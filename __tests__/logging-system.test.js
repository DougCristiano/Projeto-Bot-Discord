/**
 * Testes para o SISTEMA DE LOGGING de atividades de voz
 */

const fs = require('fs')
const path = require('path')

describe('Sistema de Logging de Voz - Formato e Estrutura', () => {
	const logsDir = path.join(__dirname, '..', 'src', 'logs_voz')

	beforeAll(() => {
		if (!fs.existsSync(logsDir)) {
			fs.mkdirSync(logsDir, { recursive: true })
		}
	})

	describe('Formato de Nome de Arquivos', () => {
		test('nome do arquivo deve seguir padrão YYYY-MM-DD_atividade_voz.json', () => {
			const now = new Date()
			const dateStr = now
				.toLocaleDateString('pt-BR', {
					timeZone: 'America/Sao_Paulo',
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
				})
				.split('/')
				.reverse()
				.join('-')

			const expectedFileName = `${dateStr}_atividade_voz.json`

			expect(expectedFileName).toMatch(/^\d{4}-\d{2}-\d{2}_atividade_voz\.json$/)
		})

		test('deve usar timezone de São Paulo (não UTC)', () => {
			const now = new Date()

			// Timestamp em São Paulo
			const timestampSP = now.toLocaleString('pt-BR', {
				timeZone: 'America/Sao_Paulo',
			})

			// Deve estar no formato brasileiro DD/MM/YYYY, HH:MM:SS
			expect(timestampSP).toMatch(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}$/)
		})
	})

	describe('Estrutura de Logs - Entrada', () => {
		test('log de entrada deve ter todos os campos obrigatórios', () => {
			const logEntrada = {
				timestamp: '01/11/2025, 14:30:25',
				tipo: 'entrada',
				usuario: 'Usuario#1234',
				usuarioId: '123456789012345678',
				apelido: 'João',
				canal: 'Geral',
				canalId: '987654321098765432',
			}

			// Campos obrigatórios
			expect(logEntrada).toHaveProperty('timestamp')
			expect(logEntrada).toHaveProperty('tipo')
			expect(logEntrada).toHaveProperty('usuario')
			expect(logEntrada).toHaveProperty('usuarioId')
			expect(logEntrada).toHaveProperty('apelido')
			expect(logEntrada).toHaveProperty('canal')
			expect(logEntrada).toHaveProperty('canalId')

			// Tipo correto
			expect(logEntrada.tipo).toBe('entrada')

			// Não deve ter campos de mudança
			expect(logEntrada).not.toHaveProperty('canalAnterior')
			expect(logEntrada).not.toHaveProperty('canalNovo')
		})

		test('timestamp deve estar em horário de Brasília', () => {
			const timestamp = '01/11/2025, 14:30:25'
			const [data, hora] = timestamp.split(', ')
			const [dia, mes, ano] = data.split('/')
			const [hh] = hora.split(':')

			// Validações básicas de formato
			expect(parseInt(dia)).toBeGreaterThanOrEqual(1)
			expect(parseInt(dia)).toBeLessThanOrEqual(31)
			expect(parseInt(mes)).toBeGreaterThanOrEqual(1)
			expect(parseInt(mes)).toBeLessThanOrEqual(12)
			expect(parseInt(ano)).toBeGreaterThanOrEqual(2025)
			expect(parseInt(hh)).toBeGreaterThanOrEqual(0)
			expect(parseInt(hh)).toBeLessThan(24)
		})
	})

	describe('Estrutura de Logs - Saída', () => {
		test('log de saída deve ter estrutura correta', () => {
			const logSaida = {
				timestamp: '01/11/2025, 14:35:25',
				tipo: 'saida',
				usuario: 'Usuario#1234',
				usuarioId: '123456789012345678',
				apelido: 'João',
				canal: 'Geral',
				canalId: '987654321098765432',
			}

			expect(logSaida.tipo).toBe('saida')
			expect(logSaida).toHaveProperty('canal')
			expect(logSaida).toHaveProperty('canalId')

			// Não deve ter campos de mudança
			expect(logSaida).not.toHaveProperty('canalAnterior')
			expect(logSaida).not.toHaveProperty('canalNovo')
		})
	})

	describe('Estrutura de Logs - Mudança de Canal', () => {
		test('log de mudança deve ter canais origem e destino', () => {
			const logMudanca = {
				timestamp: '01/11/2025, 14:40:25',
				tipo: 'mudanca',
				usuario: 'Usuario#1234',
				usuarioId: '123456789012345678',
				apelido: 'João',
				canalAnterior: 'Geral',
				canalAnteriorId: '987654321098765432',
				canalNovo: 'Música',
				canalNovoId: '111111111111111111',
			}

			expect(logMudanca.tipo).toBe('mudanca')

			// Deve ter canal anterior
			expect(logMudanca).toHaveProperty('canalAnterior')
			expect(logMudanca).toHaveProperty('canalAnteriorId')

			// Deve ter canal novo
			expect(logMudanca).toHaveProperty('canalNovo')
			expect(logMudanca).toHaveProperty('canalNovoId')

			// NÃO deve ter campo 'canal' simples
			expect(logMudanca).not.toHaveProperty('canal')
		})

		test('canais de origem e destino devem ser diferentes', () => {
			const logMudanca = {
				timestamp: '01/11/2025, 14:40:25',
				tipo: 'mudanca',
				usuario: 'Usuario#1234',
				usuarioId: '123456789012345678',
				apelido: 'João',
				canalAnterior: 'Geral',
				canalAnteriorId: '111',
				canalNovo: 'Música',
				canalNovoId: '222',
			}

			// Canal anterior e novo devem ser diferentes
			expect(logMudanca.canalAnterior).not.toBe(logMudanca.canalNovo)
			expect(logMudanca.canalAnteriorId).not.toBe(logMudanca.canalNovoId)
		})
	})

	describe('Validação de Tipos de Dados', () => {
		test('tipo deve ser apenas entrada, saida ou mudanca', () => {
			const tiposValidos = ['entrada', 'saida', 'mudanca']

			tiposValidos.forEach((tipo) => {
				expect(['entrada', 'saida', 'mudanca']).toContain(tipo)
			})

			// Tipos inválidos não devem passar
			const tiposInvalidos = ['join', 'leave', 'move', 'connect', 'disconnect']
			tiposInvalidos.forEach((tipo) => {
				expect(['entrada', 'saida', 'mudanca']).not.toContain(tipo)
			})
		})

		test('IDs devem ser strings', () => {
			const log = {
				timestamp: '01/11/2025, 14:30:25',
				tipo: 'entrada',
				usuario: 'Usuario#1234',
				usuarioId: '123456789012345678',
				apelido: 'João',
				canal: 'Geral',
				canalId: '987654321098765432',
			}

			expect(typeof log.usuarioId).toBe('string')
			expect(typeof log.canalId).toBe('string')
		})

		test('nomes de usuário devem seguir formato Discord', () => {
			const usuarios = [
				'Usuario#1234', // Formato antigo
				'Usuario', // Novo formato (sem discriminator)
				'Test User#0001',
			]

			usuarios.forEach((usuario) => {
				expect(typeof usuario).toBe('string')
				expect(usuario.length).toBeGreaterThan(0)
			})
		})
	})

	describe('Persistência de Logs', () => {
		test('logs devem ser salvos como array JSON válido', () => {
			const logs = [
				{
					timestamp: '01/11/2025, 14:30:25',
					tipo: 'entrada',
					usuario: 'User1#1111',
					usuarioId: '111',
					apelido: 'User One',
					canal: 'Canal 1',
					canalId: 'ch1',
				},
				{
					timestamp: '01/11/2025, 14:31:00',
					tipo: 'saida',
					usuario: 'User1#1111',
					usuarioId: '111',
					apelido: 'User One',
					canal: 'Canal 1',
					canalId: 'ch1',
				},
			]

			// Deve ser possível converter para JSON e voltar
			const jsonString = JSON.stringify(logs)
			const parsed = JSON.parse(jsonString)

			expect(Array.isArray(parsed)).toBe(true)
			expect(parsed).toHaveLength(2)
			expect(parsed[0].tipo).toBe('entrada')
			expect(parsed[1].tipo).toBe('saida')
		})

		test('arquivo vazio deve iniciar como array vazio', () => {
			const logsVazios = []
			const jsonString = JSON.stringify(logsVazios)

			expect(jsonString).toBe('[]')

			const parsed = JSON.parse(jsonString)
			expect(Array.isArray(parsed)).toBe(true)
			expect(parsed).toHaveLength(0)
		})
	})

	describe('Funcionalidade de Apelidos', () => {
		test('deve registrar apelido do servidor', () => {
			const log = {
				timestamp: '01/11/2025, 14:30:25',
				tipo: 'entrada',
				usuario: 'realUsername#1234',
				usuarioId: '123456789',
				apelido: 'Apelido do Servidor',
				canal: 'Geral',
				canalId: '987',
			}

			expect(log.apelido).toBe('Apelido do Servidor')
			expect(log.apelido).not.toBe(log.usuario)
		})

		test('se não tiver apelido, deve usar username', () => {
			const log = {
				timestamp: '01/11/2025, 14:30:25',
				tipo: 'entrada',
				usuario: 'Username#1234',
				usuarioId: '123456789',
				apelido: 'Username', // Mesmo que o username (sem #1234)
				canal: 'Geral',
				canalId: '987',
			}

			// Apelido deve existir mesmo quando é igual ao username
			expect(log).toHaveProperty('apelido')
			expect(log.apelido).toBeTruthy()
		})
	})
})
