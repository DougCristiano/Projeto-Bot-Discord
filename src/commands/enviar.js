const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enviar')
        .setDescription('Envia o arquivo de transcrição atual'),

    async execute(interaction, client, isAutomatic = false) {
        const session = client.recordingSessions.get(interaction.guild.id);
        if (!session) {
            if (!isAutomatic) {
                return interaction.reply({
                    content: '❌ Não há uma sessão de gravação ativa.',
                    ephemeral: true
                });
            }
            return;
        }

        try {
            const fileStats = await fs.stat(session.fileName);
            if (fileStats.size === 0) {
                if (!isAutomatic) {
                    await interaction.reply({
                        content: '❌ Nenhuma transcrição foi registrada nesta sessão.',
                        ephemeral: true
                    });
                }
                return;
            }

            // Prepara o conteúdo do arquivo com cabeçalho
            const header = `=== Transcrição da Reunião ===\nInício: ${session.startTime.toLocaleString('pt-BR')}\nFim: ${new Date().toLocaleString('pt-BR')}\n\n`;
            const content = await fs.readFile(session.fileName, 'utf-8');
            await fs.writeFile(session.fileName, header + content);

            // Envia o arquivo para o canal
            await session.textChannel.send({
                content: '📝 **Transcrição da reunião:**',
                files: [{
                    attachment: session.fileName,
                    name: 'transcricao.txt',
                    description: 'Transcrição da reunião de voz'
                }]
            });

            // Se não for automático, mantém a sessão ativa
            if (!isAutomatic) {
                await interaction.reply({
                    content: '✅ Arquivo de transcrição enviado com sucesso!',
                    ephemeral: true
                });
            } else {
                // Se for automático (chamado pelo comando sair), limpa a sessão
                client.recordingSessions.delete(interaction.guild.id);
            }

        } catch (error) {
            console.error('Erro ao enviar arquivo de transcrição:', error);
            if (!isAutomatic) {
                await interaction.reply({
                    content: '❌ Erro ao enviar o arquivo de transcrição.',
                    ephemeral: true
                });
            }
        }
    },
};