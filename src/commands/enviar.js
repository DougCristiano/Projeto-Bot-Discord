const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs').promises

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
			const fileStats = await fs.stat(session.fileName)
			if (fileStats.size === 0) {
				if (!isAutomatic) {
					await interaction.reply({
						content: '❌ Nenhuma transcrição foi registrada nesta sessão.',
						flags: 1 << 6,
					})
				}
				return
			}

			// Lê o arquivo de transcrição JSON
			const fileContent = await fs.readFile(session.fileName, 'utf-8')
			const transcriptions = JSON.parse(fileContent)

			// Prepara os dados com cabeçalho
			const transcriptionData = {
				sesssao: {
					inicio: session.startTime.toLocaleString('pt-BR'),
					fim: new Date().toLocaleString('pt-BR'),
					quantidadeTranscricoes: transcriptions.length,
				},
				transcricoes: transcriptions,
			}

			// Salva o arquivo com os dados estruturados
			await fs.writeFile(session.fileName, JSON.stringify(transcriptionData, null, 2))

			// Envia o arquivo para o canal
			await session.textChannel.send({
				content: '📝 **Transcrição da reunião (JSON):**',
				files: [
					{
						attachment: session.fileName,
						name: 'transcricao.json',
						description: 'Transcrição da reunião de voz em JSON',
					},
				],
			})

			// Se não for automático, mantém a sessão ativa
			if (!isAutomatic) {
				await interaction.reply({
					content: '✅ Arquivo de transcrição enviado com sucesso!',
					flags: 1 << 6,
				})
			} else {
				// Se for automático (chamado pelo comando sair), limpa a sessão
				client.recordingSessions.delete(interaction.guild.id)
			}
		} catch (error) {
			console.error('Erro ao enviar arquivo de transcrição:', error)
			if (!isAutomatic) {
				await interaction.reply({
					content: '❌ Erro ao enviar o arquivo de transcrição.',
					flags: 1 << 6,
				})
			}
		}
	},
}
