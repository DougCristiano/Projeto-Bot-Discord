const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs').promises
const path = require('path')

module.exports = {
	data: new SlashCommandBuilder().setName('enviar').setDescription('Envia o arquivo de transcrição atual'),

	async execute(interaction, client, isAutomatic = false) {
		const session = client.recordingSessions.get(interaction.guild.id)
		if (!session) {
			if (!isAutomatic) {
				return interaction.reply({
					content: '❌ Não há uma sessão de gravação ativa.',
					flags: 1 << 6,
				})
			}
			return
		}

		try {
			const files = []

			// Processa arquivo de transcrição
			try {
				const fileContent = await fs.readFile(session.fileName, 'utf-8')
				const parsedContent = JSON.parse(fileContent)
				const transcriptions = Array.isArray(parsedContent)
					? parsedContent
					: Array.isArray(parsedContent?.transcricoes)
						? parsedContent.transcricoes
						: []

				if (transcriptions.length > 0) {
					const transcriptionData = {
						sessao: {
							inicio: session.startTime.toLocaleString('pt-BR'),
							fim: new Date().toLocaleString('pt-BR'),
							quantidadeTranscricoes: transcriptions.length,
						},
						transcricoes: transcriptions,
					}

					files.push({
						attachment: Buffer.from(JSON.stringify(transcriptionData, null, 2), 'utf-8'),
						name: 'transcricao.json',
						description: 'Transcrição da reunião de voz em JSON',
					})
				}
			} catch (error) {
				console.error('Erro ao processar transcrição:', error)
			}

			// Processa arquivo de áudio
			try {
				if (session.audioFileName) {
					const audioStats = await fs.stat(session.audioFileName)
					if (audioStats.size > 0) {
						files.push({
							attachment: session.audioFileName,
							name: path.basename(session.audioFileName),
							description: 'Áudio gravado da reunião de voz em MP3',
						})
					}
				}
			} catch (error) {
				console.error('Erro ao processar áudio:', error)
			}

			// Se não há arquivos, retorna erro
			if (files.length === 0) {
				if (!isAutomatic) {
					await interaction.reply({
						content: '❌ Nenhuma transcrição ou áudio foi registrado nesta sessão.',
						flags: 1 << 6,
					})
				}
				return
			}

			// Envia os arquivos para o canal
			await session.textChannel.send({
				content: `📝 **Gravação da reunião (${files.length} arquivo${files.length > 1 ? 's' : ''})**`,
				files: files,
			})

			// Se não for automático, mantém a sessão ativa
			if (!isAutomatic) {
				await interaction.reply({
					content: '✅ Arquivos enviados com sucesso!',
					flags: 1 << 6,
				})
			} else {
				// Se for automático (chamado pelo comando sair), limpa a sessão
				client.recordingSessions.delete(interaction.guild.id)
			}
		} catch (error) {
			console.error('Erro ao enviar arquivos:', error)
			if (!isAutomatic) {
				await interaction.reply({
					content: '❌ Erro ao enviar os arquivos.',
					flags: 1 << 6,
				})
			}
		}
	},
}
