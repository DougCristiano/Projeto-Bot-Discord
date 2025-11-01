# 🤖 Como Criar e Configurar o Bot Discord

## 📋 Pré-requisitos
- Conta no Discord
- Acesso ao Discord Developer Portal

---

## 🚀 Passo a Passo

### 1. Criar o Bot no Discord Developer Portal

#### 1.1. Acessar o Portal
1. Vá para: **https://discord.com/developers/applications**
2. Faça login com sua conta Discord
3. Clique em **"New Application"**
4. Digite um nome (ex: "INBot")
5. Clique em **"Create"**

#### 1.2. Obter o CLIENT_ID
1. Na página inicial da Application, procure por **"APPLICATION ID"**
2. Clique em **"Copy"**
3. ✅ Este é o seu `CLIENT_ID`!

---

### 2. Configurar o Bot

#### 2.1. Criar o Bot
1. No menu lateral esquerdo, clique em **"Bot"**
2. Clique em **"Add Bot"**
3. Confirme clicando em **"Yes, do it!"**

#### 2.2. Obter o DISCORD_TOKEN
1. Na seção "Token", clique em **"Reset Token"**
2. Confirme a ação
3. Clique em **"Copy"** para copiar o token
4. ⚠️ **IMPORTANTE:** Guarde este token em segurança! Ele só aparece uma vez!
5. ✅ Este é o seu `DISCORD_TOKEN`!

#### 2.3. Ativar os Intents
Role para baixo até **"Privileged Gateway Intents"** e ative:
- ✅ **PRESENCE INTENT**
- ✅ **SERVER MEMBERS INTENT**
- ✅ **MESSAGE CONTENT INTENT**

Clique em **"Save Changes"**

---

### 3. Adicionar o Bot ao Servidor

#### 3.1. Gerar URL de Convite
1. No menu lateral, clique em **"OAuth2"** → **"URL Generator"**

2. Em **"SCOPES"**, marque:
   - ✅ **bot**
   - ✅ **applications.commands**

3. Em **"BOT PERMISSIONS"**, marque:
   - ✅ **Read Messages/View Channels**
   - ✅ **Send Messages**
   - ✅ **Send Messages in Threads**
   - ✅ **Attach Files**
   - ✅ **Read Message History**
   - ✅ **Connect** (para canais de voz)
   - ✅ **Speak** (para canais de voz)
   - ✅ **Use Voice Activity**

#### 3.2. Adicionar ao Servidor
1. Copie a **"GENERATED URL"** no final da página
2. Cole a URL no navegador
3. Selecione o servidor onde deseja adicionar o bot
4. Clique em **"Autorizar"**
5. Complete o CAPTCHA (se solicitado)

---

### 4. Configurar o Projeto

#### 4.1. Criar o arquivo .env
1. Na raiz do projeto, copie o arquivo `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e cole suas credenciais:
   ```env
   DISCORD_TOKEN=seu_token_copiado_do_discord_developer_portal
   CLIENT_ID=seu_application_id_copiado_do_discord
   ```
   
   **Exemplo de formato (substitua pelos valores reais):**
   ```env
   DISCORD_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXX.XXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXX
   CLIENT_ID=000000000000000000
   ```

#### 4.2. Registrar os Comandos
Execute o script de deploy para registrar os comandos no Discord:
```bash
node src/deploy-commands.js
```

Você verá:
```
🔄 Iniciando a atualização dos comandos slash (/)...
✅ Comandos slash (/) registrados com sucesso!
```

#### 4.3. Iniciar o Bot
```bash
node src/index.js
```

Você verá:
```
✅ Comando carregado: ajuda
✅ Comando carregado: entrar
✅ Comando carregado: enviar
✅ Comando carregado: logs_voz
✅ Comando carregado: sair
✅ Bot online como INBot#1234
🚀 Bot inicializado com sucesso!
```

---

## 🔒 Segurança

### ⚠️ NUNCA compartilhe seu token!
- O token do bot é como uma senha
- Qualquer pessoa com o token pode controlar seu bot
- Se o token vazar, **resete imediatamente** no Developer Portal

### ✅ Boas práticas:
- ✅ Mantenha o `.env` no `.gitignore` (já está configurado)
- ✅ Não faça commit do arquivo `.env`
- ✅ Use `.env.example` para mostrar a estrutura sem expor credenciais
- ✅ Se o token vazar, resete-o imediatamente no Discord Developer Portal

---

## 📊 Verificar se Funcionou

1. **Bot apareceu no servidor?**
   - ✅ Você deve ver o bot na lista de membros (offline inicialmente)

2. **Bot ficou online?**
   - ✅ Após executar `node src/index.js`, o bot deve aparecer online

3. **Comandos funcionam?**
   - ✅ Digite `/` no Discord e veja se os comandos do bot aparecem
   - ✅ Teste com `/ajuda` para ver todos os comandos

4. **Logs de voz funcionam?**
   - ✅ Entre em um canal de voz
   - ✅ Verifique se apareceu log no console do bot
   - ✅ Verifique a pasta `logs_console/` e `src/logs_voz/`

---

## 🐛 Solução de Problemas

### Bot não fica online
- Verifique se o token está correto no `.env`
- Verifique se não há espaços extras no token
- Certifique-se de que salvou o arquivo `.env`

### Comandos não aparecem no Discord
- Execute `node src/deploy-commands.js` novamente
- Aguarde alguns minutos (pode demorar para sincronizar)
- Verifique se o `CLIENT_ID` está correto

### Bot não registra atividades de voz
- Verifique se os Intents estão ativados no Developer Portal
- Certifique-se de que ativou **"SERVER MEMBERS INTENT"**
- Reinicie o bot após ativar os Intents

### Erro de permissões
- Verifique se o bot tem as permissões necessárias no servidor
- O bot precisa de permissões para ler canais e mensagens

---

## 📚 Recursos Úteis

- **Discord Developer Portal:** https://discord.com/developers/applications
- **Documentação Discord.js:** https://discord.js.org/
- **Guia Discord.js:** https://discordjs.guide/

---

## ✅ Checklist Final

Antes de começar a usar o bot, certifique-se de que:

- [ ] Criou a Application no Discord Developer Portal
- [ ] Obteve o APPLICATION ID (CLIENT_ID)
- [ ] Criou o Bot e obteve o Token (DISCORD_TOKEN)
- [ ] Ativou os Privileged Gateway Intents
- [ ] Gerou a URL de convite e adicionou o bot ao servidor
- [ ] Criou o arquivo `.env` com as credenciais
- [ ] Executou `node src/deploy-commands.js`
- [ ] Executou `node src/index.js`
- [ ] Bot aparece online no Discord
- [ ] Comandos aparecem ao digitar `/`
- [ ] Testou a funcionalidade de logs de voz

🎉 Se todos os itens estiverem marcados, seu bot está pronto para uso!
