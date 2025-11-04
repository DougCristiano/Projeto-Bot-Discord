#!/bin/bash

echo "📋 Visualizando logs do INBot..."
echo "Pressione Ctrl+C para sair"
echo ""

# Tenta com docker compose primeiro, depois docker-compose
if command -v docker compose &> /dev/null; then
    docker compose logs -f --tail=100
elif command -v docker-compose &> /dev/null; then
    docker-compose logs -f --tail=100
else
    echo "❌ Docker Compose não encontrado!"
    exit 1
fi
