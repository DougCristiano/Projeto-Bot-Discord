const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder().setName('ajuda').setDescription('Mostra todos os comandos disponíveis'),

	async execute(interaction) {
		const helpEmbed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle('📚 Comandos Disponíveis')
			.setDescription('Lista de todos os comandos que você pode usar:')
			.addFields(
				{ name: '/entrar', value: 'Entra no canal de voz e inicia a gravação' },
				{ name: '/sair', value: 'Sai do canal de voz e encerra a gravação' },
				{ name: '/enviar', value: 'Envia o arquivo de transcrição atual' },
				{
					name: '/logs_voz [data] [canal]',
					value: 'Envia os logs de entrada/saída dos canais de voz. Pode filtrar por data e/ou canal específico',
				},
				{ name: '/ajuda', value: 'Mostra esta mensagem de ajuda' }
			)
			.setFooter({ text: 'INBot - Bot de Transcrição de Voz' })

		await interaction.reply({
			embeds: [helpEmbed],
			ephemeral: true,
		})
	},
}
