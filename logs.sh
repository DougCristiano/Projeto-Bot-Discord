#!/bin/bash

echo "📋 Visualizando logs do INBot..."
echo "Pressione Ctrl+C para sair"
echo ""

docker compose logs -f --tail=100
