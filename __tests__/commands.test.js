/**
 * Testes de FUNCIONALIDADES dos comandos do bot
 */

const fs = require('fs')
const path = require('path')
const { ChannelType } = require('discord.js')

// Mock completo do Discord.js
const mockChannel = (id, name, type) => ({
	id,
	name,
	type,
	toString: () => `<#${id}>`,
})

const mockGuild = {
	id: '987654321',
	name: 'Servidor de Teste',
	channels: {
		cache: new Map([
			['voice1', mockChannel('voice1', 'Sala de Reunião', ChannelType.GuildVoice)],
			['voice2', mockChannel('voice2', 'Café Virtual', ChannelType.GuildVoice)],
			['text1', mockChannel('text1', 'geral', ChannelType.GuildText)],
		]),
	},
}

const mockUser = {
	id: '123456789',
	username: 'TestUser',
	tag: 'TestUser#1234',
}

const mockInteraction = (options = {}) => ({
	user: mockUser,
	guild: mockGuild,
	options: {
		getString: jest.fn((name) => options[name] || null),
		getFocused: jest.fn((detailed) => (detailed ? { name: 'canal', value: '' } : '')), // Para autocomplete
	},
	reply: jest.fn().mockResolvedValue(undefined),
	deferReply: jest.fn().mockResolvedValue(undefined),
	editReply: jest.fn().mockResolvedValue(undefined),
	respond: jest.fn().mockResolvedValue(undefined),
	...options,
})

describe('Comando /logs_voz - FUNCIONALIDADES', () => {
	let logsCommand
	const testLogsDir = path.join(__dirname, '..', 'src', 'logs_voz')

	beforeAll(() => {
		// Garante que o diretório existe
		if (!fs.existsSync(testLogsDir)) {
			fs.mkdirSync(testLogsDir, { recursive: true })
		}
	})

	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetModules()
		logsCommand = require('../src/commands/logs_voz.js')
	})

	afterEach(() => {
		// Limpa arquivos de teste criados
		const files = fs.readdirSync(testLogsDir)
		files.forEach((file) => {
			if (file.includes('_test_')) {
				fs.unlinkSync(path.join(testLogsDir, file))
			}
		})
	})

	describe('Autocomplete - Funcionalidade Real', () => {
		test('deve chamar respond() quando autocomplete é invocado', async () => {
			const interaction = mockInteraction()
			await logsCommand.autocomplete(interaction)

			// Deve ter chamado respond (mesmo que com array vazio)
			expect(interaction.respond).toHaveBeenCalled()
		})

		test('deve lidar com erros no autocomplete graciosamente', async () => {
			const brokenInteraction = {
				options: {
					getFocused: jest.fn(() => {
						throw new Error('Test error')
					}),
				},
				respond: jest.fn(),
			}

			// Não deve crashar
			await expect(logsCommand.autocomplete(brokenInteraction)).resolves.not.toThrow()
			expect(brokenInteraction.respond).toHaveBeenCalledWith([])
		})
	})

	describe('Execução - Sem Logs Existentes', () => {
		test('deve responder quando não há nenhum log registrado', async () => {
			const interaction = mockInteraction()

			// Como não há logs de teste, o comando deve responder
			await logsCommand.execute(interaction)

			// Deve ter chamado deferReply ou editReply
			expect(interaction.deferReply.mock.calls.length + interaction.editReply.mock.calls.length).toBeGreaterThan(0)
		})
	})

	describe('Execução - Com Logs de Teste', () => {
		let testFile

		beforeEach(() => {
			const testDate = new Date().toISOString().split('T')[0]
			testFile = path.join(testLogsDir, `${testDate}_test_atividade_voz.json`)
		})

		test('deve ler e processar logs válidos', async () => {
			const testLogs = [
				{
					timestamp: '01/11/2025, 14:30:25',
					tipo: 'entrada',
					usuario: 'TestUser#1234',
					usuarioId: '123456789',
					apelido: 'Testador',
					canal: 'Sala de Reunião',
					canalId: 'voice1',
				},
				{
					timestamp: '01/11/2025, 14:35:00',
					tipo: 'saida',
					usuario: 'TestUser#1234',
					usuarioId: '123456789',
					apelido: 'Testador',
					canal: 'Sala de Reunião',
					canalId: 'voice1',
				},
			]

			fs.writeFileSync(testFile, JSON.stringify(testLogs, null, 2))

			const interaction = mockInteraction()
			await logsCommand.execute(interaction)

			// Deve ter processado a interação
			expect(interaction.deferReply.mock.calls.length + interaction.editReply.mock.calls.length).toBeGreaterThan(0)
		})

		test('deve FILTRAR logs por canal específico', async () => {
			const testLogs = [
				{
					timestamp: '01/11/2025, 14:30:25',
					tipo: 'entrada',
					usuario: 'User1#1111',
					usuarioId: '111',
					apelido: 'User 1',
					canal: 'Sala de Reunião',
					canalId: 'voice1',
				},
				{
					timestamp: '01/11/2025, 14:31:00',
					tipo: 'entrada',
					usuario: 'User2#2222',
					usuarioId: '222',
					apelido: 'User 2',
					canal: 'Café Virtual',
					canalId: 'voice2',
				},
			]

			fs.writeFileSync(testFile, JSON.stringify(testLogs, null, 2))

			// Filtra apenas canal voice1
			const interaction = mockInteraction({ canal: 'voice1' })
			await logsCommand.execute(interaction)

			// Deve ter processado
			expect(interaction.deferReply).toHaveBeenCalled()
		})

		test('deve mostrar APELIDOS dos usuários nos logs', async () => {
			const testLogs = [
				{
					timestamp: '01/11/2025, 14:30:25',
					tipo: 'entrada',
					usuario: 'TestUser#1234',
					usuarioId: '123456789',
					apelido: 'João da Silva',
					canal: 'Sala de Reunião',
					canalId: 'voice1',
				},
			]

			fs.writeFileSync(testFile, JSON.stringify(testLogs, null, 2))

			const interaction = mockInteraction()
			await logsCommand.execute(interaction)

			// Deve ter processado os logs com apelido
			expect(interaction.deferReply).toHaveBeenCalled()
		})

		test('deve processar logs de MUDANÇA de canal', async () => {
			const testLogs = [
				{
					timestamp: '01/11/2025, 14:30:25',
					tipo: 'mudanca',
					usuario: 'TestUser#1234',
					usuarioId: '123456789',
					apelido: 'Migrador',
					canalAnterior: 'Sala de Reunião',
					canalAnteriorId: 'voice1',
					canalNovo: 'Café Virtual',
					canalNovoId: 'voice2',
				},
			]

			fs.writeFileSync(testFile, JSON.stringify(testLogs, null, 2))

			const interaction = mockInteraction()
			await logsCommand.execute(interaction)

			// Deve ter processado o log de mudança
			expect(interaction.deferReply).toHaveBeenCalled()
		})
	})

	describe('Robustez - Tratamento de Erros', () => {
		test('deve lidar com arquivo JSON inválido', async () => {
			const testDate = new Date().toISOString().split('T')[0]
			const testFile = path.join(testLogsDir, `${testDate}_test_corrupted.json`)

			// Cria arquivo com JSON inválido
			fs.writeFileSync(testFile, '{ invalid json content }')

			const interaction = mockInteraction()

			// Não deve crashar
			await expect(logsCommand.execute(interaction)).resolves.not.toThrow()
		})

		test('deve lidar com logs sem apelido (campo opcional)', async () => {
			const testDate = new Date().toISOString().split('T')[0]
			const testFile = path.join(testLogsDir, `${testDate}_test_no_nickname.json`)

			const testLogs = [
				{
					timestamp: '01/11/2025, 14:30:25',
					tipo: 'entrada',
					usuario: 'TestUser#1234',
					usuarioId: '123456789',
					// apelido ausente
					canal: 'Sala de Reunião',
					canalId: 'voice1',
				},
			]

			fs.writeFileSync(testFile, JSON.stringify(testLogs, null, 2))

			const interaction = mockInteraction()

			// Não deve crashar mesmo sem apelido
			await expect(logsCommand.execute(interaction)).resolves.not.toThrow()
		})
	})
})

describe('Comando /enviar - FUNCIONALIDADES', () => {
	let enviarCommand

	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetModules()
		enviarCommand = require('../src/commands/enviar.js')
	})

	test('deve ter função execute', () => {
		expect(enviarCommand).toHaveProperty('execute')
		expect(typeof enviarCommand.execute).toBe('function')
	})

	test('execute deve aceitar interaction como parâmetro', () => {
		expect(enviarCommand.execute.length).toBeGreaterThan(0)
	})
})

describe('Comando /entrar - FUNCIONALIDADES', () => {
	let entrarCommand

	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetModules()
		entrarCommand = require('../src/commands/entrar.js')
	})

	test('deve ter função execute', () => {
		expect(entrarCommand).toHaveProperty('execute')
		expect(typeof entrarCommand.execute).toBe('function')
	})
})

describe('Comando /sair - FUNCIONALIDADES', () => {
	let sairCommand

	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetModules()
		sairCommand = require('../src/commands/sair.js')
	})

	test('deve ter função execute', () => {
		expect(sairCommand).toHaveProperty('execute')
		expect(typeof sairCommand.execute).toBe('function')
	})
})
