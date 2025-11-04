#!/bin/bash

echo "� Iniciando deploy do INBot..."
echo ""

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Erro: Arquivo .env não encontrado!"
    echo "Crie um arquivo .env com as seguintes variáveis:"
    echo "DISCORD_TOKEN=seu_token_aqui"
    echo "CLIENT_ID=seu_client_id_aqui"
    exit 1
fi

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Erro: Docker não está instalado!"
    echo "Instale o Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verifica se o Docker Compose está instalado
if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "❌ Erro: Docker Compose não está instalado!"
    echo "Instale o Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Para o container antigo se existir
echo "🛑 Parando containers antigos..."
docker compose down 2>/dev/null || docker-compose down 2>/dev/null

# Reconstrói a imagem
echo ""
echo "🔨 Construindo a imagem Docker..."
if ! docker compose build || ! docker-compose build; then
    echo ""
    echo "❌ Erro ao construir a imagem!"
    exit 1
fi

# Inicia o container
echo ""
echo "🚀 Iniciando o bot..."
if docker compose up -d || docker-compose up -d; then
    echo ""
    echo "✅ Deploy concluído com sucesso!"
    echo ""
    echo "📋 Comandos disponíveis:"
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
    echo "📊 Comandos úteis:"
    echo "  • Ver logs: ./logs.sh"
    echo "  • Parar bot: ./stop.sh"
    echo "  • Reiniciar bot: ./restart.sh"
    echo "  • Ver status: docker compose ps"
else
    echo ""
    echo "❌ Erro ao iniciar o container!"
    exit 1
fi
