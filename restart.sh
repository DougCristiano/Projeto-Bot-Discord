#!/bin/bash

echo "🔄 Reiniciando o INBot..."

if docker compose restart; then
    echo "✅ Bot reiniciado com sucesso!"
else
    echo "❌ Erro ao reiniciar o bot!"
    exit 1
fi
