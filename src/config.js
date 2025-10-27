/**
 * Configurações do bot
 */
module.exports = {
    // Configurações dos Slash Commands
    slashCommands: {
        entrar: {
            name: 'entrar',
            description: 'Entra no canal de voz e inicia a gravação',
        },
        sair: {
            name: 'sair',
            description: 'Sai do canal de voz e encerra a gravação',
        },
        enviar: {
            name: 'enviar',
            description: 'Envia o arquivo de transcrição atual',
        },
        help: {
            name: 'ajuda',
            description: 'Mostra todos os comandos disponíveis',
        }
    },
    
    // Configurações de conexão
    connection: {
        timeout: 30000, // 30 segundos
    },
    
    // Configurações de arquivo
    files: {
        transcription: 'transcricoes/[data]_transcricao.txt',
        transcriptionDir: 'transcricoes'
    }
};