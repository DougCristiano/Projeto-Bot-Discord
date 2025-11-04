#!/bin/bash

echo "🛑 Parando o INBot..."

# Tenta com docker compose primeiro, depois docker-compose
if docker compose down 2>/dev/null || docker-compose down 2>/dev/null; then
    echo "✅ Bot parado com sucesso!"
else
    echo "❌ Erro ao parar o bot!"
    exit 1
fi
