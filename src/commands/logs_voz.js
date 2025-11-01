/**
 * Comando para enviar os logs de atividade de voz
 */

const { SlashCommandBuilder, AttachmentBuilder, ChannelType } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs_voz')
        .setDescription('Envia o arquivo de logs de atividade dos canais de voz')
        .addStringOption(option =>
            option.setName('data')
                .setDescription('Data dos logs (formato: YYYY-MM-DD). Deixe vazio para hoje.')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('canal')
                .setDescription('Nome do canal para filtrar (deixe vazio para todos os canais)')
                .setRequired(false)
                .setAutocomplete(true)
        ),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            // Determina a data do log
            const dateInput = interaction.options.getString('data');
            const channelFilter = interaction.options.getString('canal');
            let dateStr;
            
            if (dateInput) {
                // Valida o formato da data
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(dateInput)) {
                    return await interaction.editReply('❌ Formato de data inválido! Use: YYYY-MM-DD (ex: 2025-11-01)');
                }
                dateStr = dateInput;
            } else {
                // Usa a data de hoje
                const now = new Date();
                dateStr = now.toLocaleDateString('pt-BR', {
                    timeZone: 'America/Sao_Paulo',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).split('/').reverse().join('-');
            }

            // Define o caminho do arquivo de log JSON
            const voiceLogDir = path.join(__dirname, '..', 'logs_voz');
            const jsonLogFile = path.join(voiceLogDir, `${dateStr}_atividade_voz.json`);

            // Verifica se o arquivo existe
            let logs = [];
            try {
                const fileContent = await fs.readFile(jsonLogFile, 'utf-8');
                logs = JSON.parse(fileContent);
            } catch {
                return await interaction.editReply(`❌ Não há logs de atividade de voz para a data ${dateStr}.`);
            }

            if (logs.length === 0) {
                return await interaction.editReply(`❌ O arquivo de logs para ${dateStr} está vazio.`);
            }

            // Filtra por canal se especificado
            let filteredLogs = logs;
            if (channelFilter) {
                const lowerChannel = channelFilter.toLowerCase();
                filteredLogs = logs.filter(log => {
                    // Verifica entradas e saídas
                    if (log.canal && log.canal.toLowerCase() === lowerChannel) {
                        return true;
                    }
                    // Verifica mudanças de canal (origem ou destino)
                    if (log.tipo === 'mudanca') {
                        return log.canalOrigem?.toLowerCase() === lowerChannel || 
                               log.canalDestino?.toLowerCase() === lowerChannel;
                    }
                    return false;
                });
                
                if (filteredLogs.length === 0) {
                    return await interaction.editReply(`❌ Não foram encontradas atividades para o canal "${channelFilter}" na data ${dateStr}.`);
                }
            }

            // Gera o conteúdo formatado para enviar
            const formattedContent = filteredLogs.map(log => {
                const emoji = log.tipo === 'entrada' ? '🟢' : log.tipo === 'saida' ? '🔴' : '🔄';
                
                if (log.tipo === 'mudanca') {
                    return `[${log.timestamp}] ${emoji} ${log.usuario} mudou de ${log.canalOrigem} para ${log.canalDestino}`;
                } else {
                    const acao = log.tipo === 'entrada' ? 'entrou no canal' : 'saiu do canal';
                    return `[${log.timestamp}] ${emoji} ${log.usuario} ${acao}: ${log.canal}`;
                }
            }).join('\n');

            // Salva em arquivo temporário para enviar
            const tempDir = path.join(__dirname, '..', 'logs_voz', 'temp');
            await fs.mkdir(tempDir, { recursive: true });
            
            const fileName = channelFilter 
                ? `${dateStr}_${channelFilter.replace(/\s+/g, '_')}_atividade_voz.txt`
                : `${dateStr}_atividade_voz.txt`;
            
            const tempFile = path.join(tempDir, fileName);
            await fs.writeFile(tempFile, formattedContent);

            // Cria o anexo
            const attachment = new AttachmentBuilder(tempFile, { name: fileName });

            // Conta as estatísticas
            const entradas = filteredLogs.filter(log => log.tipo === 'entrada').length;
            const saidas = filteredLogs.filter(log => log.tipo === 'saida').length;
            const mudancas = filteredLogs.filter(log => log.tipo === 'mudanca').length;

            let replyMessage = `📊 **Logs de Atividade de Voz - ${dateStr}**\n\n`;
            
            if (channelFilter) {
                replyMessage += `🎯 **Canal filtrado:** ${channelFilter}\n\n`;
            }
            
            replyMessage += `🟢 Entradas: ${entradas}\n` +
                           `🔴 Saídas: ${saidas}\n` +
                           `🔄 Mudanças de canal: ${mudancas}\n` +
                           `📝 Total de eventos: ${filteredLogs.length}`;

            await interaction.editReply({
                content: replyMessage,
                files: [attachment]
            });

            // Remove o arquivo temporário após 5 segundos
            setTimeout(async () => {
                try {
                    await fs.unlink(tempFile);
                } catch (err) {
                    console.error('Erro ao remover arquivo temporário:', err);
                }
            }, 5000);

        } catch (error) {
            console.error('Erro ao enviar logs de voz:', error);
            await interaction.editReply('❌ Ocorreu um erro ao buscar os logs de voz.');
        }
    },

    async autocomplete(interaction) {
        try {
            const focusedOption = interaction.options.getFocused(true);
            
            // Autocomplete apenas para o campo 'canal'
            if (focusedOption.name === 'canal') {
                const focusedValue = focusedOption.value.toLowerCase();
                
                // Busca todos os canais de voz do servidor
                const voiceChannels = interaction.guild.channels.cache
                    .filter(channel => channel.type === ChannelType.GuildVoice)
                    .map(channel => channel.name);
                
                // Filtra os canais baseado no que o usuário digitou
                const filtered = voiceChannels
                    .filter(name => name.toLowerCase().includes(focusedValue))
                    .slice(0, 25) // Discord limita a 25 opções
                    .map(name => ({
                        name: name,
                        value: name
                    }));
                
                // Se não houver canais filtrados, mostra todos (até 25)
                if (filtered.length === 0 && focusedValue === '') {
                    const allChannels = voiceChannels
                        .slice(0, 25)
                        .map(name => ({
                            name: name,
                            value: name
                        }));
                    
                    await interaction.respond(allChannels);
                } else {
                    await interaction.respond(filtered);
                }
            }
        } catch (error) {
            console.error('Erro no autocomplete:', error);
            await interaction.respond([]);
        }
    }
};
