/**
 * INBot - Bot de Discord para transcrição de voz
 * @author IN Junior
 * @version 1.0.0
 */

const { Client, Collection, GatewayIntentBits, Events } = require('discord.js')
const { addSpeechEvent } = require('discord-speech-recognition')
const fs = require('fs').promises
const path = require('path')
require('dotenv').config()

// Cria uma nova instância do cliente com os intents necessários
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
})

// Coleções para armazenar comandos e estados
client.commands = new Collection()
client.voiceConnections = new Collection()
client.recordingSessions = new Collection()

// Configuração do reconhecimento de voz
addSpeechEvent(client, {
	lang: 'pt-BR',
	profanityFilter: false,
})

// Carrega todos os comandos
async function loadCommands() {
	const commandsPath = path.join(__dirname, 'commands')
	const commandFiles = (await fs.readdir(commandsPath)).filter((file) => file.endsWith('.js'))

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		const command = require(filePath)

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command)
			console.log(`✅ Comando carregado: ${command.data.name}`)
		} else {
			console.log(`❌ Comando inválido em ${filePath}`)
		}
	}
}

// Gerenciador de interações
client.on(Events.InteractionCreate, async (interaction) => {
	// Gerencia autocomplete
	if (interaction.isAutocomplete()) {
		const command = client.commands.get(interaction.commandName)
		if (!command || !command.autocomplete) return

		try {
			await command.autocomplete(interaction)
		} catch (error) {
			console.error('Erro no autocomplete:', error)
		}
		return
	}

	// Gerencia comandos
	if (!interaction.isChatInputCommand()) return

	const command = client.commands.get(interaction.commandName)
	if (!command) return

	try {
		await command.execute(interaction, client)
	} catch (error) {
		console.error(error)
		if (!interaction.replied && !interaction.deferred) {
			await interaction.reply({
				content: '❌ Ocorreu um erro ao executar este comando!',
				ephemeral: true,
			})
		}
	}
})

// Gerenciador de transcrições
client.on('speech', async (message) => {
	if (!message.content) return

	try {
		const session = client.recordingSessions.get(message.guild.id)
		if (!session) return

		const now = new Date()
		const timestamp = now.toISOString()
		const text = `[${timestamp}] ${message.author.username}: ${message.content}\n`

		console.log(`✍️ Nova transcrição: ${text}`)

		// Cria o diretório de transcrições se não existir
		const dir = path.dirname(session.fileName)
		await fs.mkdir(dir, { recursive: true })

		// Salva a transcrição no arquivo da sessão
		await fs.appendFile(session.fileName, text)
	} catch (error) {
		console.error('❌ Erro ao processar transcrição:', error)
	}
})

// Gerenciador de atividades de canais de voz
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
	try {
		const member = newState.member
		const now = new Date()

		// Converte para o horário do Brasil (America/Sao_Paulo)
		const timestamp = now.toLocaleString('pt-BR', {
			timeZone: 'America/Sao_Paulo',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		})

		const dateStr = now
			.toLocaleDateString('pt-BR', {
				timeZone: 'America/Sao_Paulo',
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			})
			.split('/')
			.reverse()
			.join('-') // Formato YYYY-MM-DD

		// Define o caminho dos arquivos de log
		const voiceLogDir = path.join(__dirname, 'logs_voz')
		await fs.mkdir(voiceLogDir, { recursive: true })
		const jsonLogFile = path.join(voiceLogDir, `${dateStr}_atividade_voz.json`)
		const consoleLogDir = path.join(__dirname, '..', 'logs')
		await fs.mkdir(consoleLogDir, { recursive: true })
		const consoleLogFile = path.join(consoleLogDir, `${dateStr}_console_voz.txt`)

		let eventData = null
		let consoleMessage = ''

		// Usuário entrou em um canal de voz
		if (!oldState.channel && newState.channel) {
			eventData = {
				timestamp: timestamp,
				tipo: 'entrada',
				usuario: member.user.tag,
				usuarioId: member.user.id,
				apelido: member.nickname || member.user.username,
				canal: newState.channel.name,
				canalId: newState.channel.id,
			}
			consoleMessage = `[${timestamp}] 🟢 ${member.nickname || member.user.username} entrou em ${newState.channel.name}`
			console.log(consoleMessage)
		}
		// Usuário saiu de um canal de voz
		else if (oldState.channel && !newState.channel) {
			eventData = {
				timestamp: timestamp,
				tipo: 'saida',
				usuario: member.user.tag,
				usuarioId: member.user.id,
				apelido: member.nickname || member.user.username,
				canal: oldState.channel.name,
				canalId: oldState.channel.id,
			}
			consoleMessage = `[${timestamp}] 🔴 ${member.nickname || member.user.username} saiu de ${oldState.channel.name}`
			console.log(consoleMessage)
		}
		// Usuário mudou de canal
		else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
			eventData = {
				timestamp: timestamp,
				tipo: 'mudanca',
				usuario: member.user.tag,
				usuarioId: member.user.id,
				apelido: member.nickname || member.user.username,
				canalOrigem: oldState.channel.name,
				canalOrigemId: oldState.channel.id,
				canalDestino: newState.channel.name,
				canalDestinoId: newState.channel.id,
			}
			consoleMessage = `[${timestamp}] 🔄 ${member.nickname || member.user.username} mudou de ${oldState.channel.name} para ${newState.channel.name}`
			console.log(consoleMessage)
		}

		// Salva os logs
		if (eventData) {
			// Salva no arquivo JSON
			let logs = []
			try {
				const fileContent = await fs.readFile(jsonLogFile, 'utf-8')
				logs = JSON.parse(fileContent)
			} catch {
				// Arquivo não existe ou está vazio, começar array novo
			}

			logs.push(eventData)
			await fs.writeFile(jsonLogFile, JSON.stringify(logs, null, 2))

			// Salva log do console
			await fs.appendFile(consoleLogFile, consoleMessage + '\n')
		}
	} catch (error) {
		console.error('❌ Erro ao registrar atividade de voz:', error)
	}
})

// Evento Ready
client.once(Events.ClientReady, () => {
	console.log(`✅ Bot online como ${client.user.tag}`)
})

// Inicialização do bot
async function initializeBot() {
	try {
		// Carrega os comandos
		await loadCommands()

		// Verifica o token
		if (!process.env.DISCORD_TOKEN) {
			throw new Error('Token do Discord não encontrado no arquivo .env')
		}

		// Faz login no Discord
		await client.login(process.env.DISCORD_TOKEN)
		console.log('🚀 Bot inicializado com sucesso!')
	} catch (error) {
		console.error('❌ Erro ao inicializar o bot:', error)
		process.exit(1)
	}
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
	console.error('❌ Erro não tratado:', error)
})

// Inicia o bot
initializeBot()
