const { SlashCommandBuilder } = require('discord.js')
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice')
const AudioRecorder = require('../utils/audioRecorder')

module.exports = {
	data: new SlashCommandBuilder().setName('entrar').setDescription('Entrando no canal de voz e inicia a gravação'),

	async execute(interaction, client) {
		const channel = interaction.member?.voice.channel
		if (!channel) {
			return interaction.reply({
				content: '❌ Você precisa estar em um canal de voz para usar este comando!',
				flags: 1 << 6,
			})
		}

		let connection
		let audioRecorder

		try {
			connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
				selfDeaf: false,
			})

			await entersState(connection, VoiceConnectionStatus.Ready, 30000)
			client.voiceConnections.set(interaction.guild.id, connection)

			// Inicia uma nova sessão de gravação
			const now = new Date()
			const sessionId = `${now.toISOString().split('T')[0]}_${now.getTime()}`

			// Cria o gravador de áudio
			audioRecorder = new AudioRecorder(connection, `audios_gravados/${sessionId}_audio.mp3`)
			await audioRecorder.ready

			client.recordingSessions.set(interaction.guild.id, {
				startTime: now,
				fileName: `transcricoes/${sessionId}_transcricao.json`,
				audioFileName: `audios_gravados/${sessionId}_audio.mp3`,
				audioRecorder,
				textChannel: interaction.channel,
			})

			await interaction.reply({
				content: '✅ Conectado ao canal de voz e iniciando gravação!',
				flags: 1 << 6,
			})
		} catch (error) {
			console.error('Erro ao conectar ao canal de voz:', error)

			if (audioRecorder) {
				await audioRecorder.cleanup().catch(() => {})
			}
			if (connection) {
				try {
					connection.destroy()
				} catch {
					// Ignora erros de desconexão
				}
			}
			client.voiceConnections.delete(interaction.guild.id)
			client.recordingSessions.delete(interaction.guild.id)

			await interaction.reply({
				content: '❌ Não foi possível conectar ao canal de voz.',
				flags: 1 << 6,
			})
		}
	},
}
