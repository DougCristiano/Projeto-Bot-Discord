# 🚀 Guia de Uso do PM2 para INBot

O PM2 é um gerenciador de processos Node.js que garante que o bot continue rodando mesmo que o servidor reinicie.

## 📋 Instalação

### 1. Instalar PM2 globalmente
```bash
npm install -g pm2
```

### 2. Configurar PM2 para iniciar na reboot do servidor
```bash
pm2 startup
pm2 save
```

## 🎮 Comandos Principais

### Iniciar o bot
```bash
npm start
# ou
./start.sh
# ou
pm2 start ecosystem.config.js
```

### Parar o bot
```bash
npm stop
# ou
./stop.sh
# ou
pm2 stop inbot
```

### Reiniciar o bot
```bash
npm restart
# ou
./restart.sh
# ou
pm2 restart inbot
```

### Ver logs em tempo real
```bash
npm run logs
# ou
./logs.sh
# ou
pm2 logs inbot
```

### Monitorar em tempo real
```bash
npm run monit
# ou
pm2 monit
```

### Ver lista de processos
```bash
pm2 list
```

### Ver informações detalhadas
```bash
pm2 info inbot
```

### Deletar o bot do PM2
```bash
pm2 delete inbot
```

## ⚙️ Configuração (ecosystem.config.js)

O arquivo `ecosystem.config.js` contém as configurações:

- **name**: Nome do processo (inbot)
- **script**: Arquivo principal (./src/index.js)
- **instances**: Número de instâncias (1)
- **exec_mode**: Modo de execução (cluster)
- **max_memory_restart**: Reinicia se usar mais de 500MB
- **autorestart**: Reinicia automaticamente se cair
- **max_restarts**: Máximo de restarts (10)
- **min_uptime**: Tempo mínimo para considerar como "iniciado com sucesso" (10s)
- **out_file**: Arquivo de saída (logs_console/pm2-out.log)
- **error_file**: Arquivo de erros (logs_console/pm2-err.log)

## 📊 Workflow Completo

### Primeira vez (Setup completo)

```bash
# 1. Clone/configure o projeto
cd Projeto-Bot-Discord

# 2. Instale as dependências
npm install

# 3. Deploy dos comandos Discord
./deploy.sh
# ou
npm run deploy

# 4. Configure PM2 para iniciar na reboot
pm2 startup
pm2 save

# 5. Inicie o bot
npm start
# ou
./start.sh
```

### Uso diário

```bash
# Ver status
pm2 list

# Ver logs
npm run logs

# Reiniciar se necessário
npm restart

# Parar
npm stop
```

## 🔄 Auto-restart na reboot do servidor

Depois de executar `pm2 startup` e `pm2 save`, o PM2 vai:
- ✅ Salvar a lista de processos
- ✅ Criar um script de inicialização do sistema
- ✅ Reiniciar o bot automaticamente quando o servidor reiniciar

### Verificar se está configurado
```bash
pm2 startup
```

### Remover auto-startup
```bash
pm2 unstartup
```

## 📁 Logs

Os logs são salvos em:
- **Saída padrão**: `logs_console/pm2-out.log`
- **Erros**: `logs_console/pm2-err.log`

Você também pode ver os logs em tempo real:
```bash
pm2 logs inbot
pm2 logs inbot --lines 100  # Últimas 100 linhas
```

## 🛡️ Resiliência

Com a configuração atual:
- Se o bot cair, PM2 o reinicia automaticamente
- Se reiniciar mais de 10 vezes em pouco tempo, para para não entrar em loop
- Se usar mais de 500MB de RAM, é reiniciado
- Logs são mantidos para debug

## 💡 Dicas

1. **Desenvolver localmente**: Use `npm run dev` para rodar sem PM2
2. **Produção**: Use `npm start` para rodar com PM2
3. **Debug**: Use `pm2 logs` para ver o que está acontecendo
4. **Monitoramento**: Use `pm2 monit` para dashboard em tempo real
5. **Backup**: Salve a configuração com `pm2 save`

## 🔗 Recursos Úteis

- [Documentação PM2](https://pm2.keymetrics.io/)
- [PM2 Plus](https://pm2.io/) - Monitoramento na nuvem (opcional)
