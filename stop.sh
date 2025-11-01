#!/bin/bash

echo "🛑 Parando INBot..."
echo ""

# Verifica se o PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "❌ Erro: PM2 não está instalado!"
    exit 1
fi

# Para o bot
if pm2 stop inbot; then
    echo ""
    echo "✅ Bot parado com sucesso!"
    echo ""
    echo "📊 Status atual:"
    pm2 list
else
    echo "❌ Erro ao parar o bot!"
    echo "O bot pode não estar em execução."
    exit 1
fi
