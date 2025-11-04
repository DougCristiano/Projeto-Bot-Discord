#!/bin/bash

echo "🔄 Reiniciando o INBot..."

# Tenta com docker compose primeiro, depois docker-compose
if docker compose restart 2>/dev/null || docker-compose restart 2>/dev/null; then
    echo "✅ Bot reiniciado com sucesso!"
else
    echo "❌ Erro ao reiniciar o bot!"
    exit 1
fi
