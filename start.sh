#!/bin/bash

echo "🤖 Iniciando INBot com PM2..."
echo ""

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Erro: Arquivo .env não encontrado!"
    echo "Execute primeiro: ./deploy.sh"
    exit 1
fi

# Verifica se o PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "❌ Erro: PM2 não está instalado!"
    echo "Instale com: npm install -g pm2"
    exit 1
fi

# Para qualquer instância anterior do bot
echo "Parando instâncias anteriores..."
pm2 delete inbot 2>/dev/null || true

# Inicia o bot com PM2
echo "Iniciando o bot..."
if pm2 start ecosystem.config.js; then
    echo ""
    echo "✅ Bot iniciado com sucesso!"
    echo ""
    echo "📊 Informações do processo:"
    pm2 list
    echo ""
    echo "🔍 Para monitorar em tempo real:"
    echo "   pm2 monit"
    echo ""
    echo "📝 Para ver os logs:"
    echo "   pm2 logs inbot"
    echo ""
    echo "🛑 Para parar o bot:"
    echo "   pm2 stop inbot"
    echo ""
    echo "🔄 Para reiniciar o bot:"
    echo "   pm2 restart inbot"
    echo ""
    echo "⚙️ Para remover o bot do PM2:"
    echo "   pm2 delete inbot"
    echo ""
else
    echo "❌ Erro ao iniciar o bot!"
    exit 1
fi
