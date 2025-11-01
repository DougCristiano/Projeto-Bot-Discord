#!/bin/bash

echo "🚀 Iniciando deploy dos comandos do bot..."
echo ""

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Erro: Arquivo .env não encontrado!"
    echo "Crie um arquivo .env com as seguintes variáveis:"
    echo "DISCORD_TOKEN=seu_token_aqui"
    echo "CLIENT_ID=seu_client_id_aqui"
    exit 1
fi

# Executa o deploy dos comandos
node src/deploy-commands.js

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📋 Comandos registrados:"
echo "  • /entrar - Entra no canal de voz e inicia a gravação"
echo "  • /sair - Sai do canal de voz e encerra a gravação"
echo "  • /enviar - Envia o arquivo de transcrição atual"
echo "  • /logs_voz - Envia os logs de atividade dos canais de voz"
echo "  • /ajuda - Mostra todos os comandos disponíveis"
echo ""
echo "🎙️ O bot agora registrará automaticamente:"
echo "  • 🟢 Entradas em canais de voz"
echo "  • 🔴 Saídas de canais de voz"
echo "  • 🔄 Mudanças entre canais de voz"
echo ""
echo "📁 Os logs serão salvos em: src/logs_voz/"
echo ""
