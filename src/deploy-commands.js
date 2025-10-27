const { REST, Routes } = require('discord.js');
const config = require('./config.js');
require('dotenv').config();

const commands = [];

// Converte a configuração dos comandos para o formato do Discord
for (const cmd of Object.values(config.slashCommands)) {
    commands.push({
        name: cmd.name,
        description: cmd.description,
    });
}

// Cria uma nova instância do REST
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Função para implantar os comandos
async function deployCommands() {
    try {
        console.log('🔄 Iniciando a atualização dos comandos slash (/)...');

        // O método put é usado para registrar todos os comandos
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('✅ Comandos slash (/) registrados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao registrar os comandos:', error);
    }
}

deployCommands();