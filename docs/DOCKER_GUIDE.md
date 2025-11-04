# 🐳 Guia de Uso do INBot com Docker

Este guia explica como usar o INBot dockerizado.

## 📋 Pré-requisitos

- Docker instalado ([Download aqui](https://docs.docker.com/get-docker/))
- Docker Compose instalado (geralmente vem com o Docker Desktop)
- Arquivo `.env` configurado com suas credenciais do Discord

## 🚀 Primeiros Passos

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
DISCORD_TOKEN=seu_token_do_discord_aqui
CLIENT_ID=seu_client_id_aqui
```

### 2. Deploy inicial

Execute o script de deploy:

```bash
chmod +x deploy.sh
./deploy.sh
```

Isso vai:
- ✅ Construir a imagem Docker
- ✅ Criar os volumes para logs e transcrições
- ✅ Fazer deploy dos comandos do Discord
- ✅ Iniciar o bot

## 📊 Comandos Úteis

### Scripts disponíveis

```bash
# Fazer deploy/atualizar o bot
./deploy.sh

# Ver logs em tempo real
./logs.sh

# Reiniciar o bot
./restart.sh

# Parar o bot
./stop.sh
```

### Comandos Docker diretos

```bash
# Ver status do container
docker compose ps

# Ver logs
docker compose logs -f

# Parar o bot
docker compose down

# Iniciar o bot
docker compose up -d

# Reiniciar o bot
docker compose restart

# Reconstruir a imagem (após mudanças no código)
docker compose build

# Ver uso de recursos
docker stats inbot-discord
```

## 🔧 Desenvolvimento

### Modo de desenvolvimento com hot-reload

Para desenvolvimento, você pode descomentar o volume do código no `docker-compose.yml`:

```yaml
volumes:
  - ./logs:/app/logs
  - ./transcricoes:/app/transcricoes
  - ./src:/app/src  # <- Descomentar esta linha
```

Depois, use nodemon ou similar dentro do container.

### Acessar o shell do container

```bash
docker compose exec inbot sh
```

### Ver arquivos de log

```bash
# Logs do Docker
docker compose logs

# Logs salvos pela aplicação
ls -la logs/
cat logs/voice_activity_*.log
```

### Ver transcrições

```bash
ls -la transcricoes/
cat transcricoes/*.txt
```

## 🐛 Troubleshooting

### Bot não inicia

```bash
# Verificar logs
docker compose logs

# Verificar se as variáveis de ambiente estão corretas
docker compose config

# Reconstruir do zero
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Problemas com permissões de arquivo

```bash
# Dar permissão aos diretórios
chmod 777 logs/ transcricoes/
```

### Container reinicia constantemente

```bash
# Ver os logs para identificar o erro
docker compose logs --tail=50

# Verificar se o .env está correto
cat .env
```

### Atualizar o bot após mudanças no código

```bash
# Parar, reconstruir e iniciar
docker compose down
docker compose build
docker compose up -d
```

## 📦 Estrutura de Volumes

O Docker monta os seguintes diretórios do host no container:

- `./logs` → `/app/logs` - Logs de console (console_voz.txt)
- `./transcricoes` → `/app/transcricoes` - Arquivos de transcrição de áudio
- `./logs_voz` → `/app/logs_voz` - Logs de atividade de voz (JSON)

**Importante**: Isso significa que os dados persistem mesmo se o container for removido. Tudo que o bot salvar nestes diretórios ficará no seu computador.

📖 **Para entender melhor como funciona a persistência de arquivos, veja [DOCKER_PERSISTENCIA.md](./DOCKER_PERSISTENCIA.md)**

## 🔒 Segurança

- ✅ O arquivo `.env` não é copiado para a imagem (ver `.dockerignore`)
- ✅ Apenas dependências de produção são instaladas
- ✅ O container roda com usuário não-root (Node.js)
- ✅ Limites de recursos configurados para evitar uso excessivo

## 🚀 Deploy em Produção

### Em um VPS/Servidor

1. Clone o repositório
2. Configure o `.env`
3. Execute `./deploy.sh`
4. Configure para iniciar automaticamente no boot:

```bash
# O restart policy 'unless-stopped' já cuida disso
# Mas você pode garantir que o Docker inicie no boot:
sudo systemctl enable docker
```

### Usando Docker Swarm

```bash
docker swarm init
docker stack deploy -c docker-compose.yml inbot
```

### Usando Kubernetes

Você pode gerar manifestos Kubernetes a partir do docker-compose:

```bash
# Usando kompose
kompose convert
```

## 📈 Monitoramento

### Ver uso de recursos

```bash
docker stats inbot-discord
```

### Ver saúde do container

```bash
docker compose ps
docker inspect inbot-discord
```

## 🔄 Backup

### Backup dos logs e transcrições

```bash
tar -czf backup-$(date +%Y%m%d).tar.gz logs/ transcricoes/
```

### Restaurar backup

```bash
tar -xzf backup-YYYYMMDD.tar.gz
```

## 📝 Notas

- O bot faz deploy dos comandos automaticamente na inicialização
- Os logs do Docker são rotacionados automaticamente (máx 3 arquivos de 10MB)
- O container reinicia automaticamente em caso de falha (`restart: unless-stopped`)
- Recursos limitados a 512MB RAM e 1 CPU core (ajuste conforme necessário)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `./logs.sh`
2. Verifique o status: `docker compose ps`
3. Reconstrua a imagem: `docker compose build --no-cache`
4. Verifique as issues do repositório

## 🎯 Próximos Passos

- [ ] Configurar CI/CD com GitHub Actions
- [ ] Adicionar healthcheck ao container
- [ ] Configurar monitoramento com Prometheus
- [ ] Implementar testes automatizados antes do build
