# Use a imagem oficial do Node.js 22.14
FROM node:22.14-alpine

# Instala dependências do sistema necessárias para o bot de voz
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    ffmpeg \
    opus \
    opus-dev

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --only=production

# Copia o código da aplicação
COPY . .

# Cria os diretórios necessários para persistência de dados
# Estes diretórios serão montados como volumes no docker-compose.yml
RUN mkdir -p logs transcricoes logs_voz

# Define variáveis de ambiente padrão (serão sobrescritas pelo .env)
ENV NODE_ENV=production

# Executa o deploy dos comandos e inicia o bot
CMD node src/deploy-commands.js && node src/index.js
