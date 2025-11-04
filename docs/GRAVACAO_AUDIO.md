# 🎙️ Guia de Gravação de Áudio

## Visão Geral

O INBot agora suporta gravação de áudio em MP3 além da transcrição de texto. Quando você usa os comandos de voz, o bot grava:

1. **Transcrição em JSON** - Contém o texto de tudo que foi falado
2. **Áudio em MP3** - Arquivo de áudio completo da gravação

## Como Funciona

### Fluxo de Gravação

```
/entrar
  ↓
Bot entra no canal de voz
  ↓
Inicia gravação de áudio + transcrição
  ↓
[Você fala - tudo é registrado]
  ↓
/sair
  ↓
Bot para gravação e processa áudio (WAV → MP3)
  ↓
Salva ambos os arquivos
  ↓
/enviar (automático ao usar /sair)
  ↓
Envia arquivo de transcrição (JSON) + áudio (MP3)
```

## Arquivos Gerados

### Estrutura de Diretórios

```
projeto/
├── transcricoes/          # Transcrições em JSON
│   └── 2025-11-04_1234567890_transcricao.json
│
├── audios_gravados/       # Áudios em MP3
│   └── 2025-11-04_1234567890_audio.mp3
│
└── ...
```

### Exemplo de Nomes de Arquivos

- **Transcrição:** `2025-11-04_1732099200000_transcricao.json`
- **Áudio:** `2025-11-04_1732099200000_audio.mp3`

O padrão é: `YYYY-MM-DD_timestamp_tipo.extensão`

## Formato dos Arquivos

### Transcrição JSON

```json
{
  "sesssao": {
    "inicio": "04/11/2025, 14:30:45",
    "fim": "04/11/2025, 14:35:20",
    "quantidadeTranscricoes": 5
  },
  "transcricoes": [
    {
      "timestamp": "2025-11-04T14:30:50.000Z",
      "autor": "João",
      "autorId": "123456789",
      "conteudo": "Olá pessoal, como estão?"
    },
    {
      "timestamp": "2025-11-04T14:30:55.000Z",
      "autor": "Maria",
      "autorId": "987654321",
      "conteudo": "Tudo bem!"
    }
  ]
}
```

### Áudio MP3

- Formato: MP3 (comprimido)
- Qualidade: 128 kbps (padrão)
- Conteúdo: Áudio bruto de todas as conversas do canal

## Dependências

A feature de gravação de áudio requer:

1. **fluent-ffmpeg** - Para converter áudio WAV para MP3
2. **prism-media** - Para processar streams de áudio

Estas dependências já estão instaladas no projeto:

```bash
npm install --save fluent-ffmpeg prism-media
```

## Limitações

⚠️ **Importante:**

1. **FFmpeg necessário** - Para converter WAV para MP3, você precisa ter o FFmpeg instalado no sistema
   - Windows: Use Chocolatey: `choco install ffmpeg`
   - Linux: Use apt: `sudo apt-get install ffmpeg`
   - macOS: Use Homebrew: `brew install ffmpeg`

2. **Tamanho de arquivo** - Áudios podem ficar grandes dependendo da duração
   - Cada 1 minuto de áudio ≈ 1MB (com qualidade 128kbps)

3. **Tempo de processamento** - A conversão WAV → MP3 leva alguns segundos

4. **Qualidade de áudio** - Depende da qualidade do microfone dos usuários

## Usando a Feature

### Passo 1: Entrar no Canal

```
/entrar
```

O bot entrará no seu canal de voz e começará a gravar tanto transcrição quanto áudio.

### Passo 2: Usar o Canal Normalmente

Fale normalmente - tudo será gravado:
- A transcrição em tempo real
- O áudio em background

### Passo 3: Sair do Canal

```
/sair
```

O bot irá:
1. ⏹️ Parar a gravação de áudio
2. 🔄 Converter WAV → MP3 (leva alguns segundos)
3. 📤 Enviar automaticamente o arquivo de transcrição + áudio

### Passo 4 (Opcional): Enviar Novamente

Se quiser enviar os arquivos novamente sem sair do canal:

```
/enviar
```

Isso reenvia a transcrição e áudio atualizados até o momento.

## Exemplos de Uso

### Gravação de Reunião

```
1. /entrar
   ✅ Bot conecta ao canal e começa a gravar

2. [Reunião acontece - tudo é registrado]

3. /sair
   ✅ Bot sai e envia transcrição + áudio para o canal
```

### Salvando Múltiplas Sessões

```
Sessão 1:
- /entrar
- [Conversa 1]
- /sair → Salva em: 2025-11-04_1732090000000_*

Sessão 2:
- /entrar
- [Conversa 2]
- /sair → Salva em: 2025-11-04_1732093600000_*
```

## Solução de Problemas

### Erro: "FFmpeg não encontrado"

**Solução:** Instale o FFmpeg no seu sistema operacional

- **Windows:** `choco install ffmpeg`
- **Linux:** `sudo apt-get install ffmpeg`
- **macOS:** `brew install ffmpeg`

Depois reinicie o bot:
```bash
npm run restart
```

### Áudio vazio ou muito pequeno

**Possíveis causas:**
1. Ninguém falou durante a gravação
2. Problema com permissões de áudio do bot

**Solução:**
- Verifique se o bot tem permissão de "Connect" e "Speak" no canal de voz
- Teste com mais pessoas falando

### Arquivo MP3 não é criado

**Solução:**
1. Verifique se FFmpeg está instalado: `ffmpeg -version`
2. Verifique os logs do bot: `npm run logs`
3. Certifique-se de que há espaço em disco

## Armazenamento

### Localização dos Arquivos

- **Transcrições:** Pasta `transcricoes/`
- **Áudios:** Pasta `audios_gravados/`

### Gerenciamento

Para liberar espaço, você pode deletar sesões antigas:

```bash
# Deletar áudios com mais de 7 dias
find audios_gravados/ -type f -mtime +7 -delete

# Deletar transcrições com mais de 7 dias
find transcricoes/ -type f -mtime +7 -delete
```

## Performance

### Impacto de Sistema

- **Processamento:** ~5-10% CPU durante a gravação
- **Memória:** ~50-100MB durante a sessão
- **Disco:** ~1MB por minuto de áudio (a 128kbps)

### Otimizações

Se o bot ficar lento:
1. Feche outros processos pesados
2. Reduzir a duração das sessões
3. Aumentar a qualidade do servidor

## API Interna

### Classe AudioRecorder

```javascript
const AudioRecorder = require('./utils/audioRecorder')

// Criar gravador
const recorder = new AudioRecorder(voiceConnection, 'output.mp3')

// Parar gravação e salvar
await recorder.stopRecording()

// Limpar recursos
recorder.cleanup()
```

### Eventos da Sessão

A sessão de gravação armazena:

```javascript
session = {
  startTime: Date,           // Quando começou
  fileName: string,          // Caminho da transcrição
  audioFileName: string,     // Caminho do áudio
  audioRecorder: AudioRecorder,
  textChannel: Channel       // Canal para enviar arquivos
}
```

## Futuras Melhorias

Ideias para aprimorar a feature:

- [ ] Separar áudios por usuário
- [ ] Diferentes formatos de áudio (WAV, OGG, FLAC)
- [ ] Ajustar qualidade de áudio
- [ ] Compactação automática
- [ ] Upload para serviços na nuvem
- [ ] Sincronização entre áudio e transcrição

---

**Última atualização:** 4 de novembro de 2025
