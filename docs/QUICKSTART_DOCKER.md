# 🎯 Início Rápido - Docker

## ⚡ TL;DR - Para começar agora

```bash
# 1. Configure o .env
cat > .env << EOF
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=seu_client_id_aqui
EOF

# 2. Faça o deploy
./deploy.sh

# 3. Veja os logs
./logs.sh
```

## 📋 Checklist de Deploy

- [ ] Docker e Docker Compose instalados
- [ ] Arquivo `.env` criado com TOKEN e CLIENT_ID
- [ ] Bot criado no Discord Developer Portal
- [ ] Scripts com permissão de execução (`chmod +x docker-*.sh`)
- [ ] Executar `./deploy.sh`
- [ ] Bot aparecendo online no Discord
- [ ] Testar comando `/ajuda`

## 🔍 Verificar se está funcionando

```bash
# Ver status do container
docker compose ps

# Ver logs em tempo real
./logs.sh

# Verificar recursos utilizados
docker stats inbot-discord
```

## 🛠️ Comandos Principais

| Ação | Comando |
|------|---------|
| **Iniciar** | `./deploy.sh` |
| **Ver logs** | `./logs.sh` |
| **Reiniciar** | `./restart.sh` |
| **Parar** | `./stop.sh` |
| **Status** | `docker compose ps` |
| **Recursos** | `docker stats inbot-discord` |

## 🐛 Problemas Comuns

### Bot não inicia

```bash
# Ver logs detalhados
docker compose logs --tail=100

# Reconstruir do zero
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Erro de permissão em logs/transcricoes

```bash
chmod 777 logs/ transcricoes/
```

### Atualizar código

```bash
# Após modificar o código
./deploy.sh  # Reconstrói e reinicia automaticamente
```

## 📖 Documentação Completa

Para mais detalhes, veja [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)
