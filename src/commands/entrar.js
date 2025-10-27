const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('entrar')
        .setDescription('Entra no canal de voz e inicia a gravação'),

    async execute(interaction, client) {
        const channel = interaction.member?.voice.channel;
        if (!channel) {
            return interaction.reply({
                content: '❌ Você precisa estar em um canal de voz para usar este comando!',
                ephemeral: true
            });
        }

        try {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });

            await entersState(connection, VoiceConnectionStatus.Ready, 30000);
            client.voiceConnections.set(interaction.guild.id, connection);
            
            // Inicia uma nova sessão de gravação
            const now = new Date();
            const sessionId = now.toISOString().split('T')[0] + '_' + now.getTime();
            
            client.recordingSessions.set(interaction.guild.id, {
                startTime: now,
                fileName: `transcricoes/${sessionId}_transcricao.txt`,
                textChannel: interaction.channel
            });

            await interaction.reply({
                content: '✅ Conectado ao canal de voz e iniciando gravação!',
                ephemeral: true
            });

        } catch (error) {
            console.error('Erro ao conectar ao canal de voz:', error);
            await interaction.reply({
                content: '❌ Não foi possível conectar ao canal de voz.',
                ephemeral: true
            });
        }
    },
};