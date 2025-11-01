#!/bin/bash

echo "📝 Logs do INBot (PM2)"
echo ""

# Verifica se o PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "❌ Erro: PM2 não está instalado!"
    exit 1
fi

# Mostra os logs do bot
pm2 logs inbot
