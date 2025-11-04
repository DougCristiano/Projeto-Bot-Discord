# Implementação de Gravação de Áudio MP3

## 📋 Resumo

Foi implementada a funcionalidade de gravação de áudio em MP3 no INBot. Agora, quando você usa os comandos de voz, o bot salva:

1. **Transcrição em JSON** - Texto de todas as conversas
2. **Áudio em MP3** - Arquivo de áudio completo

## 🔧 Mudanças Realizadas

### 1. Novo Módulo: `src/utils/audioRecorder.js`

Classe `AudioRecorder` que:
- Captura streams de áudio dos usuários
- Armazena dados em buffer
- Converte WAV para MP3 usando FFmpeg
- Gerencia o ciclo de vida da gravação

**Funcionalidades:**
```javascript
const recorder = new AudioRecorder(connection, 'output.mp3')

// Parar e converter para MP3
await recorder.stopRecording()

// Limpar recursos
recorder.cleanup()
```

### 2. Comando `/entrar` - Atualizado

**Arquivo:** `src/commands/entrar.js`

**Mudanças:**
- Cria instância de `AudioRecorder`
- Armazena caminho de áudio na sessão
- Mantém referência ao gravador para parar depois

**Sessão agora contém:**
```javascript
{
  fileName: 'transcricoes/..._transcricao.json',
  audioFileName: 'audios_gravados/..._audio.mp3',
  audioRecorder: AudioRecorder,
  startTime: Date,
  textChannel: Channel
}
```

### 3. Comando `/sair` - Atualizado

**Arquivo:** `src/commands/sair.js`

**Mudanças:**
- Para a gravação de áudio antes de desconectar
- Aguarda a conversão WAV → MP3
- Limpa recursos do gravador
- Chama `/enviar` automaticamente

### 4. Comando `/enviar` - Atualizado

**Arquivo:** `src/commands/enviar.js`

**Mudanças:**
- Envia arquivo de transcrição (JSON)
- Envia arquivo de áudio (MP3) - **NOVO**
- Trata erros independentes para cada arquivo
- Mostra quantidade de arquivos enviados

**Exemplo:**
```
📝 **Gravação da reunião (2 arquivos)**
[Anexa: transcricao.json]
[Anexa: audio.mp3]
```

## 📦 Dependências Adicionadas

```bash
npm install --save fluent-ffmpeg prism-media
```

- **fluent-ffmpeg** v2.1.3 - Wrapper para FFmpeg
- **prism-media** v1.3.5 - Processamento de streams de mídia

## ⚙️ Requisitos do Sistema

### FFmpeg

O FFmpeg é **necessário** para converter áudio WAV para MP3.

**Instalação:**

- **Windows (Chocolatey):**
  ```bash
  choco install ffmpeg
  ```

- **Linux (apt):**
  ```bash
  sudo apt-get install ffmpeg
  ```

- **macOS (Homebrew):**
  ```bash
  brew install ffmpeg
  ```

**Verificar instalação:**
```bash
ffmpeg -version
```

## 📂 Estrutura de Arquivos

```
projeto/
├── src/
│   ├── utils/
│   │   └── audioRecorder.js          [NOVO]
│   ├── commands/
│   │   ├── entrar.js                 [MODIFICADO]
│   │   ├── sair.js                   [MODIFICADO]
│   │   └── enviar.js                 [MODIFICADO]
│   └── ...
├── audios_gravados/                  [NOVO - Áudios em MP3]
├── transcricoes/                     [EXISTENTE - Agora com áudios]
├── docs/
│   └── GRAVACAO_AUDIO.md             [NOVO - Documentação]
└── ...
```

## 🚀 Como Usar

### Começar Gravação
```
/entrar
```

### Parar Gravação e Enviar Arquivos
```
/sair
```

### Enviar Novamente (sem sair do canal)
```
/enviar
```

## 📊 Formato dos Arquivos

### Transcrição (JSON)
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
      "conteudo": "Olá pessoal..."
    }
  ]
}
```

### Áudio (MP3)
- Formato: MP3 (comprimido)
- Qualidade: 128 kbps
- Tamanho: ~1MB por minuto

## 🔍 Logs e Monitoramento

Durante a gravação, o bot exibe:

```
✅ Gravador de áudio configurado
🎙️ Iniciado gravação de áudio do usuário: 123456789
⏹️ Parando gravação de áudio...
✅ Arquivo WAV salvo: audios_gravados/...wav
✅ Conversão para MP3 concluída: audios_gravados/...mp3
✅ Gravador de áudio limpo
```

## ⚠️ Limitações Conhecidas

1. **FFmpeg Necessário** - Sem FFmpeg, a conversão para MP3 falhará
2. **Tamanho de Arquivo** - Áudios longos podem ficar grandes
3. **Tempo de Processamento** - Conversão leva alguns segundos
4. **Permissões** - Bot precisa de permissões de "Connect" e "Speak"

## 🧪 Testes

Para testar a feature:

1. **Setup Básico:**
   ```bash
   npm install
   npm run deploy
   npm run dev
   ```

2. **Teste Manual:**
   - Use `/entrar` em um canal de voz
   - Fale algo
   - Use `/sair`
   - Verifique se os arquivos foram salvos
   - Verifique se foram enviados ao Discord

3. **Verificar Arquivos:**
   ```bash
   ls -la audios_gravados/    # Linux/macOS
   dir audios_gravados\       # Windows
   ```

## 📝 Próximos Passos

Possíveis melhorias futuras:

- [ ] Suporte a múltiplos formatos de áudio
- [ ] Separar áudios por usuário
- [ ] Ajustar qualidade de áudio
- [ ] Compactação automática
- [ ] Upload para nuvem
- [ ] Sincronização áudio-transcrição

## 🐛 Troubleshooting

### "FFmpeg not found"
```bash
# Windows
choco install ffmpeg

# Linux
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

### Nenhum áudio foi gravado
- Verifique permissões do bot no canal
- Certifique-se que alguém falou
- Verifique os logs do bot

### Arquivo MP3 não foi criado
1. Confirme que FFmpeg está instalado
2. Reinicie o bot
3. Verifique espaço em disco

## 📚 Documentação

Para mais detalhes, veja: `docs/GRAVACAO_AUDIO.md`

---

**Versão:** 1.0.0  
**Data:** 4 de novembro de 2025  
**Status:** ✅ Pronto para usar
