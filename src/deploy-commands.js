const { REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const commands = []

// Carrega todos os comandos da pasta commands
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)

	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON())
		console.log(`✅ Comando carregado: ${command.data.name}`)
	} else {
		console.log(`⚠️ Comando em ${file} está faltando "data" ou "execute"`)
	}
}

// Cria uma nova instância do REST
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

// Função para implantar os comandos
async function deployCommands() {
	try {
		console.log(`🔄 Iniciando a atualização de ${commands.length} comandos slash (/)...`)

		// O método put é usado para registrar todos os comandos
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })

		console.log('✅ Comandos slash (/) registrados com sucesso!')
	} catch (error) {
		console.error('❌ Erro ao registrar os comandos:', error)
	}
}

deployCommands()
