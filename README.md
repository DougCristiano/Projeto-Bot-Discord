# 🤖 INBot - Bot de Discord para Transcrição de Voz

Bot desenvolvido pela IN Junior para transcrição de áudio em canais de voz e monitoramento de atividades no Discord.

## ✨ Funcionalidades

### 🎙️ Transcrição de Voz
- Entra em canais de voz e transcreve conversas em tempo real
- Reconhecimento de voz em português (pt-BR)
- Salva transcrições em arquivos de texto organizados por data

### 📊 Monitoramento de Atividades de Voz
- **Registro automático** de entrada/saída de usuários em canais de voz
- Funciona **sem** precisar entrar nos canais
- Logs organizados por data
- Filtro por canal específico com autocomplete
- Estatísticas detalhadas de uso

### 🎯 Comandos Disponíveis
- `/entrar` - Entra no canal de voz e inicia a gravação
- `/sair` - Sai do canal de voz e encerra a gravação
- `/enviar` - Envia o arquivo de transcrição atual
- `/logs_voz [data] [canal]` - Consulta logs de atividade com filtros
- `/ajuda` - Mostra todos os comandos disponíveis

## 🚀 Início Rápido

### 📋 Pré-requisitos
- Node.js (v16 ou superior)
- Conta no Discord
- Servidor Discord onde você tenha permissões de administrador

### 🔧 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/DougCristiano/Projeto-Bot-Discord.git
   cd Projeto-Bot-Discord
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o bot no Discord:**
   
   📖 **[Siga o guia completo em COMO_CRIAR_BOT.md](./docs/COMO_CRIAR_BOT.md)**
   
   Este guia contém instruções detalhadas sobre:
   - Como criar o bot no Discord Developer Portal
   - Como obter o TOKEN e CLIENT_ID
   - Como configurar permissões e intents
   - Como adicionar o bot ao servidor

4. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` e adicione suas credenciais:
   ```env
   DISCORD_TOKEN=seu_token_aqui
   CLIENT_ID=seu_client_id_aqui
   ```

5. **Registre os comandos:**
   ```bash
   node src/deploy-commands.js
   ```

6. **Inicie o bot:**
   ```bash
   npm start
   ```
   
   Isso vai iniciar o bot com **PM2**, que garante que o bot continue rodando mesmo se o servidor reiniciar!

## 📚 Documentação

### � Começando

#### [COMO_CRIAR_BOT.md](./docs/COMO_CRIAR_BOT.md)
**Guia completo para criar e configurar o bot no Discord**

Este é o seu ponto de partida! Contém:
- ✅ Como criar o bot no Discord Developer Portal
- ✅ Como obter o DISCORD_TOKEN e CLIENT_ID
- ✅ Como configurar permissões e intents necessários
- ✅ Como adicionar o bot ao seu servidor
- ✅ Configuração do arquivo `.env`
- ✅ Checklist de verificação
- ✅ Solução de problemas comuns

### 📊 Funcionalidades

#### [LOGS_VOZ.md](./docs/LOGS_VOZ.md)
**Documentação completa do sistema de monitoramento de canais de voz**

Aprenda tudo sobre o sistema de logs de voz:
- 📝 Como funciona o registro automático de atividades
- 📁 Estrutura de arquivos de logs
- 🎮 Comando `/logs_voz` e seus parâmetros
- 🔍 Filtros por data e canal
- 📊 Interpretação de estatísticas

#### [GUIA_FILTRO_CANAL.md](./docs/GUIA_FILTRO_CANAL.md)
**Guia rápido e prático para usar o filtro de canais**

Guia focado em exemplos práticos:
- 🎯 Exemplos de uso do comando `/logs_voz`
- ✨ Como usar o autocomplete de canais
- 🔍 Como funciona a filtragem
- 💡 Dicas e truques

#### [PM2_GUIDE.md](./docs/PM2_GUIDE.md)
**Guia completo para usar PM2 com INBot**

Tudo sobre o gerenciador de processos PM2:
- 🚀 Como instalar e configurar PM2
- 📋 Comandos principais (start, stop, restart, logs)
- ⚙️ Auto-restart na reboot do servidor
- 📊 Monitoramento em tempo real
- 💡 Melhores práticas

### 🗺️ Fluxo de Leitura Sugerido

**Para Iniciantes:**
1. Comece com [COMO_CRIAR_BOT.md](./docs/COMO_CRIAR_BOT.md)
2. Configure o bot seguindo o guia passo a passo
3. Teste os comandos básicos
4. Leia [LOGS_VOZ.md](./docs/LOGS_VOZ.md) para entender os recursos
5. Consulte [GUIA_FILTRO_CANAL.md](./docs/GUIA_FILTRO_CANAL.md) para exemplos práticos

**Para Usuários Experientes:**
- Use [GUIA_FILTRO_CANAL.md](./docs/GUIA_FILTRO_CANAL.md) como referência rápida
- Consulte [LOGS_VOZ.md](./docs/LOGS_VOZ.md) para detalhes técnicos

## 📁 Estrutura do Projeto

```
Projeto-Bot-Discord/
├── docs/                  # Documentação do projeto
│   ├── COMO_CRIAR_BOT.md
│   ├── GUIA_FILTRO_CANAL.md
│   └── LOGS_VOZ.md
├── src/
│   ├── commands/          # Comandos do bot
│   │   ├── ajuda.js
│   │   ├── entrar.js
│   │   ├── enviar.js
│   │   ├── logs_voz.js
│   │   └── sair.js
│   ├── logs_voz/          # Logs detalhados de atividades
│   ├── transcricoes/      # Transcrições de áudio
│   ├── config.js          # Configurações do bot
│   ├── deploy-commands.js # Script de registro de comandos
│   └── index.js           # Arquivo principal
├── logs_console/          # Logs do console
├── .env                   # Variáveis de ambiente (não versionado)
├── .env.example           # Exemplo de configuração
├── package.json
└── README.md
```

## 🔒 Segurança

⚠️ **IMPORTANTE:**
- Nunca compartilhe seu `DISCORD_TOKEN`
- O arquivo `.env` está no `.gitignore` e não deve ser commitado
- Se o token vazar, resete-o imediatamente no Discord Developer Portal

## 🛠️ Tecnologias Utilizadas

- **[Discord.js v14](https://discord.js.org/)** - Biblioteca para interagir com a API do Discord
- **[discord-speech-recognition](https://www.npmjs.com/package/discord-speech-recognition)** - Reconhecimento de voz
- **[@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)** - Suporte para canais de voz
- **Node.js** - Runtime JavaScript

## 📊 Exemplos de Uso

### Monitorar atividades de voz
```
/logs_voz                              # Logs de hoje
/logs_voz canal:Geral                  # Apenas do canal "Geral"
/logs_voz data:2025-11-01 canal:Música # Data e canal específicos
```

### Transcrever conversas
```
/entrar    # Bot entra no seu canal de voz
           # Fale normalmente - tudo será transcrito
/sair      # Bot sai e encerra a gravação
/enviar    # Recebe o arquivo com a transcrição
```

## 👥 Autores

Desenvolvido pela **IN Junior**

## 📄 Licença

Este projeto está sob a licença ISC - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📞 Suporte

Se encontrar algum problema ou tiver dúvidas:
1. Consulte a [documentação](./docs/COMO_CRIAR_BOT.md)
2. Verifique os [logs do console](./logs_console/)
3. Abra uma issue no GitHub
