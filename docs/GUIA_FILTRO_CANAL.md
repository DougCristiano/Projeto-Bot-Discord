# 🎯 Guia Rápido - Filtro de Canal nos Logs de Voz

## ✨ Autocomplete Habilitado!

Ao usar o parâmetro `canal`, o Discord mostrará **automaticamente** todos os canais de voz disponíveis no servidor!

### Como usar o autocomplete:
1. Digite `/logs_voz`
2. Clique no campo `canal:`
3. **Os canais aparecem automaticamente!** 🎉
4. Comece a digitar para filtrar a lista
5. Selecione o canal desejado

---

## 📅 Exemplos de Uso do Comando `/logs_voz`

### 📅 Filtrar apenas por data
```
/logs_voz data:2025-11-01
```
Retorna: Todos os logs do dia 01/11/2025 de todos os canais

---

### 🎙️ Filtrar apenas por canal
```
/logs_voz canal:Geral
```
Retorna: Logs de hoje apenas do canal "Geral"

---

### 🎯 Filtrar por data E canal
```
/logs_voz data:2025-11-01 canal:Reunião
```
Retorna: Logs do dia 01/11/2025 apenas do canal "Reunião"

---

### 📊 Ver todos os logs de hoje
```
/logs_voz
```
Retorna: Todos os logs de hoje de todos os canais

---

## 🔍 Como o Filtro Funciona

O filtro de canal captura **todas** as atividades relacionadas ao canal especificado:

### Exemplo: Filtro por canal "Geral"

**Logs capturados:**
- ✅ `🟢 Usuario#1234 entrou no canal: Geral`
- ✅ `🔴 Usuario#5678 saiu do canal: Geral`
- ✅ `🔄 Usuario#9012 mudou de Reunião para Geral`
- ✅ `🔄 Usuario#3456 mudou de Geral para Reunião`

**Logs NÃO capturados:**
- ❌ `🟢 Usuario#7890 entrou no canal: Reunião`
- ❌ `🔴 Usuario#4567 saiu do canal: Música`
- ❌ `🔄 Usuario#2345 mudou de Reunião para Música`

---

## 💡 Dicas

1. **Nomes de canais não são case-sensitive**
   - `canal:geral`, `canal:Geral`, `canal:GERAL` → Todos funcionam igual

2. **Use o nome exato do canal**
   - Se o canal é "Sala de Reunião", use: `canal:Sala de Reunião`
   - Espaços são permitidos!
   - **💡 Dica:** Use o autocomplete! É só clicar no campo e selecionar da lista

3. **Autocomplete inteligente**
   - Mostra até 25 canais de voz do servidor
   - Filtra enquanto você digita
   - Só mostra canais que realmente existem no servidor

4. **Combine filtros para análises específicas**
   - Quer saber quem usou o canal "Música" ontem?
   - `/logs_voz data:2025-10-31 canal:Música`

5. **Estatísticas personalizadas**
   - Ao filtrar por canal, você verá:
     - Quantas pessoas entraram
     - Quantas pessoas saíram
     - Quantas mudanças de/para esse canal
     - Total de eventos relacionados

---

## 📁 Arquivos Gerados

### Sem filtro de canal:
- Arquivo: `2025-11-01_atividade_voz.txt`
- Conteúdo: Todos os eventos de todos os canais

### Com filtro de canal:
- Arquivo: `2025-11-01_Geral_atividade_voz.txt`
- Conteúdo: Apenas eventos do canal "Geral"
- Nota: Arquivo temporário, gerado sob demanda

---

## 📊 Exemplo de Resposta do Bot

```
📊 Logs de Atividade de Voz - 2025-11-01
🎯 Canal filtrado: Geral

🟢 Entradas: 8
🔴 Saídas: 7
🔄 Mudanças de canal: 3
📝 Total de eventos: 18

[Arquivo anexado: 2025-11-01_Geral_atividade_voz.txt]
```
