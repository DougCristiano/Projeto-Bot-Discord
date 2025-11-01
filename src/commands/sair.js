const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder().setName('sair').setDescription('Sai do canal de voz e encerra a gravação'),

	async execute(interaction, client) {
		const connection = client.voiceConnections.get(interaction.guild.id)
		if (!connection) {
			return interaction.reply({
				content: '❌ O bot não está em um canal de voz.',
				ephemeral: true,
			})
		}

		try {
			// Finaliza a sessão de gravação primeiro
			const session = client.recordingSessions.get(interaction.guild.id)
			if (session) {
				// Importa e executa o comando enviar
				const enviarCommand = require('./enviar')
				await enviarCommand.execute(interaction, client, true)
			}

			// Desconecta do canal
			connection.destroy()
			client.voiceConnections.delete(interaction.guild.id)

			await interaction.reply({
				content: '👋 Desconectado do canal de voz.',
				ephemeral: true,
			})
		} catch (error) {
			console.error('Erro ao desconectar do canal de voz:', error)
			await interaction.reply({
				content: '❌ Erro ao desconectar do canal de voz.',
				ephemeral: true,
			})
		}
	},
}
