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

# Instala as dependências (clean install)
echo "📦 Instalando dependências..."
if ! npm ci; then
    echo ""
    echo "❌ Erro ao instalar dependências!"
    exit 1
fi

# Verifica se o PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "❌ Erro: PM2 não está instalado!"
    echo "Instale com: npm install -g pm2"
    exit 1
fi

# Executa o deploy dos comandos e captura erros
if ! node src/deploy-commands.js; then
    echo ""
    echo "❌ Erro ao executar o deploy dos comandos!"
    echo "Verifique se o arquivo .env está correto e se o Node.js está instalado."
    exit 2
fi

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
echo "📁 Os logs serão salvos em: logs/"
echo ""
