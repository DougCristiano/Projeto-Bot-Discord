#!/bin/bash

echo "🔄 Reiniciando INBot..."
echo ""

# Verifica se o PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "❌ Erro: PM2 não está instalado!"
    exit 1
fi

# Reinicia o bot
if pm2 restart inbot; then
    echo ""
    echo "✅ Bot reiniciado com sucesso!"
    echo ""
    echo "📊 Status atual:"
    pm2 list
    echo ""
    echo "📝 Para ver os logs:"
    echo "   pm2 logs inbot"
else
    echo "❌ Erro ao reiniciar o bot!"
    echo "O bot pode não estar em execução. Use ./start.sh para iniciar."
    exit 1
fi
