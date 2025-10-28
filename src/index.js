/**
 * INBot - Bot de Discord para transcrição de voz
 * @author IN Junior
 * @version 1.0.0
 */

const { 
    Client, 
    Collection, 
    GatewayIntentBits, 
    Events 
} = require('discord.js');
const { addSpeechEvent } = require("discord-speech-recognition");
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Cria uma nova instância do cliente com os intents necessários
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ]
});

// Coleções para armazenar comandos e estados
client.commands = new Collection();
client.voiceConnections = new Collection();
client.recordingSessions = new Collection();

// Configuração do reconhecimento de voz
addSpeechEvent(client, {
    lang: 'pt-BR',
    profanityFilter: false
});

// Carrega todos os comandos
async function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Comando carregado: ${command.data.name}`);
        } else {
            console.log(`❌ Comando inválido em ${filePath}`);
        }
    }
}

// Gerenciador de interações
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Ocorreu um erro ao executar este comando!',
                ephemeral: true
            });
        }
    }
});

// Gerenciador de transcrições
client.on("speech", async (message) => {
    if (!message.content) return;

    try {
        const session = client.recordingSessions.get(message.guild.id);
        if (!session) return;

        const now = new Date();
        const timestamp = now.toISOString();
        const text = `[${timestamp}] ${message.author.username}: ${message.content}\n`;
        
        console.log(`✍️ Nova transcrição: ${text}`);

        // Cria o diretório de transcrições se não existir
        const dir = path.dirname(session.fileName);
        await fs.mkdir(dir, { recursive: true });
        
        // Salva a transcrição no arquivo da sessão
        await fs.appendFile(session.fileName, text);
    } catch (error) {
        console.error('❌ Erro ao processar transcrição:', error);
    }
});

// Evento Ready
client.once(Events.ClientReady, () => {
    console.log(`✅ Bot online como ${client.user.tag}`);
});

// Inicialização do bot
async function initializeBot() {
    try {
        // Carrega os comandos
        await loadCommands();

        // Verifica o token
        if (!process.env.DISCORD_TOKEN) {
            throw new Error('Token do Discord não encontrado no arquivo .env');
        }

        // Faz login no Discord
        await client.login(process.env.DISCORD_TOKEN);
        console.log('🚀 Bot inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar o bot:', error);
        process.exit(1);
    }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', error => {
    console.error('❌ Erro não tratado:', error);
});

// Inicia o bot
initializeBot();