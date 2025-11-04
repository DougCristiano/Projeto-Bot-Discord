#!/bin/bash

echo "🚀 Iniciando o INBot com Docker..."
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

# Inicia o container
echo "🚀 Iniciando o bot..."
if docker compose up -d || docker-compose up -d; then
    echo ""
    echo "✅ Bot iniciado com sucesso!"
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
