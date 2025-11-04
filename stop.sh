#!/bin/bash

echo "🛑 Parando o INBot..."

if docker compose down; then
    echo "✅ Bot parado com sucesso!"
else
    echo "❌ Erro ao parar o bot!"
    exit 1
fi
