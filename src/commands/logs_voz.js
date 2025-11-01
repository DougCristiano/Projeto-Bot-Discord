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
                dateStr = new Date().toISOString().split('T')[0];
            }

            // Define o caminho do arquivo de log
            const voiceLogDir = path.join(__dirname, '..', 'logs_voz');
            const voiceLogFile = path.join(voiceLogDir, `${dateStr}_atividade_voz.txt`);

            // Verifica se o arquivo existe
            try {
                await fs.access(voiceLogFile);
            } catch {
                return await interaction.editReply(`❌ Não há logs de atividade de voz para a data ${dateStr}.`);
            }

            // Lê o conteúdo do arquivo
            let content = await fs.readFile(voiceLogFile, 'utf-8');
            
            if (!content || content.trim() === '') {
                return await interaction.editReply(`❌ O arquivo de logs para ${dateStr} está vazio.`);
            }

            // Filtra por canal se especificado
            let filteredContent = content;
            let allLines = content.split('\n').filter(line => line.trim());
            
            if (channelFilter) {
                const lines = allLines.filter(line => {
                    // Procura por menções do canal no texto
                    const lowerLine = line.toLowerCase();
                    const lowerChannel = channelFilter.toLowerCase();
                    
                    // Verifica se o canal aparece após "canal:" ou em mudanças de canal
                    return lowerLine.includes(`canal: ${lowerChannel}`) ||
                           lowerLine.includes(`de ${lowerChannel} para`) ||
                           lowerLine.includes(`para ${lowerChannel}`);
                });
                
                if (lines.length === 0) {
                    return await interaction.editReply(`❌ Não foram encontradas atividades para o canal "${channelFilter}" na data ${dateStr}.`);
                }
                
                filteredContent = lines.join('\n') + '\n';
            }

            // Salva o conteúdo filtrado em um arquivo temporário se houver filtro
            let fileToSend = voiceLogFile;
            let fileName = `${dateStr}_atividade_voz.txt`;
            
            if (channelFilter) {
                const tempDir = path.join(__dirname, '..', 'logs_voz', 'temp');
                await fs.mkdir(tempDir, { recursive: true });
                fileToSend = path.join(tempDir, `${dateStr}_${channelFilter.replace(/\s+/g, '_')}_atividade_voz.txt`);
                await fs.writeFile(fileToSend, filteredContent);
                fileName = `${dateStr}_${channelFilter.replace(/\s+/g, '_')}_atividade_voz.txt`;
            }

            // Cria o anexo
            const attachment = new AttachmentBuilder(fileToSend, {
                name: fileName
            });

            // Conta as entradas e saídas (do conteúdo filtrado ou completo)
            const lines = filteredContent.split('\n').filter(line => line.trim());
            const entradas = lines.filter(line => line.includes('🟢')).length;
            const saidas = lines.filter(line => line.includes('🔴')).length;
            const mudancas = lines.filter(line => line.includes('🔄')).length;

            let replyMessage = `📊 **Logs de Atividade de Voz - ${dateStr}**\n\n`;
            
            if (channelFilter) {
                replyMessage += `🎯 **Canal filtrado:** ${channelFilter}\n\n`;
            }
            
            replyMessage += `🟢 Entradas: ${entradas}\n` +
                           `🔴 Saídas: ${saidas}\n` +
                           `🔄 Mudanças de canal: ${mudancas}\n` +
                           `📝 Total de eventos: ${lines.length}`;

            await interaction.editReply({
                content: replyMessage,
                files: [attachment]
            });

            // Remove o arquivo temporário se foi criado
            if (channelFilter) {
                setTimeout(async () => {
                    try {
                        await fs.unlink(fileToSend);
                    } catch (err) {
                        console.error('Erro ao remover arquivo temporário:', err);
                    }
                }, 5000); // Remove após 5 segundos
            }

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
