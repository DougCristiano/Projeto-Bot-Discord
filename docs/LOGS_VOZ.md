# 🎙️ Sistema de Registro de Atividade de Voz

## 📋 Descrição

O bot agora registra automaticamente todas as entradas, saídas e mudanças de canal de voz dos membros do servidor Discord.

## ✨ Funcionalidades

### Registro Automático

O bot monitora e registra:

- 🟢 **Entradas**: Quando um usuário entra em um canal de voz
- 🔴 **Saídas**: Quando um usuário sai de um canal de voz
- 🔄 **Mudanças**: Quando um usuário muda de um canal para outro

### Características

- ✅ Funciona **sem** precisar entrar nos canais de voz
- ✅ Registro automático enquanto o bot estiver online
- ✅ Logs organizados por data
- ✅ Timestamp completo de cada evento
- ✅ Arquivo de log diário separado

## 📁 Estrutura de Arquivos

Os logs são salvos em **formato JSON** para melhor filtragem e análise:

### 1. Logs estruturados (raiz do projeto)

```
logs_voz/
  ├── YYYY-MM-DD_atividade_voz.json (dados estruturados)
  └── temp/ (arquivos temporários para envio)
```

### 2. Logs do console (raiz do projeto)

```
logs/
  └── YYYY-MM-DD_console_voz.txt (mesmas mensagens do console)
```

Exemplo:

- `logs_voz/2025-11-01_atividade_voz.json` (dados JSON estruturados)
- `logs/2025-11-01_console_voz.txt` (mensagens do console)

## 📝 Formato dos Logs

### Arquivo JSON (logs_voz/)

```json
[
	{
		"timestamp": "01/11/2025, 14:30:25",
		"tipo": "entrada",
		"usuario": "Usuario#1234",
		"usuarioId": "123456789012345678",
		"apelido": "João da Silva",
		"canal": "Geral",
		"canalId": "987654321098765432"
	},
	{
		"timestamp": "01/11/2025, 14:35:10",
		"tipo": "mudanca",
		"usuario": "Usuario#1234",
		"usuarioId": "123456789012345678",
		"apelido": "João da Silva",
		"canalOrigem": "Geral",
		"canalOrigemId": "987654321098765432",
		"canalDestino": "Reunião",
		"canalDestinoId": "111222333444555666"
	},
	{
		"timestamp": "01/11/2025, 15:00:00",
		"tipo": "saida",
		"usuario": "Usuario#1234",
		"usuarioId": "123456789012345678",
		"apelido": "João da Silva",
		"canal": "Reunião",
		"canalId": "111222333444555666"
	}
]
```

### Arquivo de Console (logs/)

```
[01/11/2025, 14:30:25] 🟢 João da Silva entrou em Geral
[01/11/2025, 14:35:10] 🔄 João da Silva mudou de Geral para Reunião
[01/11/2025, 15:00:00] 🔴 João da Silva saiu de Reunião
```

## 🎮 Comando de Consulta

### `/logs_voz [data] [canal]`

Envia o arquivo de logs de atividade dos canais de voz com opção de filtrar por data e/ou canal específico.

**Parâmetros:**

- `data` (opcional): Data dos logs no formato YYYY-MM-DD
  - Se não especificado, retorna os logs de hoje
- `canal` (opcional): Nome do canal para filtrar
  - **Autocomplete habilitado**: Ao digitar, os canais de voz do servidor aparecem automaticamente
  - Se não especificado, retorna logs de todos os canais
  - O filtro é case-insensitive (não diferencia maiúsculas/minúsculas)

**Recursos do Autocomplete:**

- 🔍 Começa a digitar o nome do canal e veja sugestões em tempo real
- 📋 Lista todos os canais de voz disponíveis no servidor
- ⚡ Filtragem instantânea enquanto você digita
- ✨ Limite de 25 sugestões mais relevantes

**Exemplos:**

```
/logs_voz                                    # Logs de hoje, todos os canais
/logs_voz data:2025-11-01                    # Logs de uma data específica, todos os canais
/logs_voz canal:Geral                        # Logs de hoje, apenas do canal "Geral" (use autocomplete!)
/logs_voz data:2025-11-01 canal:Reunião      # Logs de 01/11/2025, apenas do canal "Reunião"
```

**Resposta:**
O bot envia uma mensagem com estatísticas e o arquivo de log:

```
📊 Logs de Atividade de Voz - 2025-11-01
🎯 Canal filtrado: Geral

🟢 Entradas: 15
🔴 Saídas: 12
🔄 Mudanças de canal: 5
📝 Total de eventos: 32
```

**Notas sobre o filtro de canal:**

- O filtro busca por todas as atividades relacionadas ao canal especificado
- Inclui: entradas no canal, saídas do canal, e mudanças que envolvem o canal
- **Agora muito mais preciso:** usa dados estruturados JSON em vez de busca em texto
- Filtragem por ID de canal garante 100% de precisão

## 🚀 Como Usar

### 1. Registrar os comandos

Execute o script de deploy para registrar o novo comando:

```bash
node src/deploy-commands.js
```

### 2. Iniciar o bot

```bash
node src/index.js
```

### 3. Monitoramento automático

O bot começará a registrar automaticamente todas as atividades de voz assim que estiver online.

## 🔧 Configuração

Não é necessária nenhuma configuração adicional. O sistema utiliza os mesmos intents já configurados no bot:

- `GatewayIntentBits.GuildVoiceStates` - Monitora estados de voz

## 📊 Logs do Console

O bot exibe as atividades em tempo real no console E salva essas mesmas mensagens em arquivo:

**Console e arquivo `logs/YYYY-MM-DD_console_voz.txt`:**

```
[2025-11-01T14:30:25.123Z] 🟢 Usuario#1234 entrou em Geral
[2025-11-01T14:35:10.456Z] 🔴 Usuario#5678 saiu de Reunião
[2025-11-01T15:00:00.789Z] 🔄 Usuario#9012 mudou de Geral para Reunião
```

**Arquivo detalhado `logs_voz/YYYY-MM-DD_atividade_voz.json`:**

```
[2025-11-01T14:30:25.123Z] 🟢 Usuario#1234 entrou no canal: Geral
[2025-11-01T14:35:10.456Z] 🔴 Usuario#5678 saiu do canal: Reunião
[2025-11-01T15:00:00.789Z] 🔄 Usuario#9012 mudou de Geral para Reunião
```

## ⚠️ Notas Importantes

1. Os logs são salvos localmente no servidor onde o bot está rodando
2. Um novo arquivo é criado automaticamente para cada dia
3. O bot NÃO precisa estar em um canal de voz para registrar as atividades
4. Apenas atividades de voz são registradas (não registra mute/unmute, etc.)
5. **Dois tipos de logs são gerados:**
   - `logs/` - Mesmas mensagens exibidas no console (na raiz)
   - `logs_voz/` - Logs detalhados com formato completo

## 🛠️ Solução de Problemas

### O bot não está registrando atividades

- Verifique se o bot está online e conectado
- Confirme que o intent `GuildVoiceStates` está habilitado
- Verifique as permissões do bot no servidor

### Não consigo acessar os logs

- Certifique-se de ter executado o comando `/logs_voz` corretamente
- Verifique se existem atividades registradas para a data solicitada
- Confirme que a pasta `logs_voz` foi criada corretamente
