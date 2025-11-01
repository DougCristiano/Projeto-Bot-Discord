# 🔄 GitHub Actions Workflows

## 📋 Workflows Disponíveis

### Code Quality Check

**Arquivo:** `.github/workflows/code-quality.yml`

**Quando executa:**
- ✅ Em todo push para as branches `main` e `develop`
- ✅ Em todo Pull Request para as branches `main` e `develop`

**O que verifica:**
1. **Formatação do código** (`npm run format:check`)
   - Verifica se o código está formatado conforme o Prettier
   - Não altera arquivos, apenas verifica

2. **Qualidade do código** (`npm run lint`)
   - Executa o ESLint
   - Verifica problemas de código, bugs, boas práticas

3. **Testes** (`npm test`)
   - Executa os testes do projeto
   - Continua mesmo se falhar (por enquanto)

## 🚀 Como Usar

### Localmente (antes de fazer commit)

```bash
# Verificar tudo de uma vez
npm run check

# Ou verificar individualmente:
npm run format:check  # Verifica formatação
npm run lint          # Verifica qualidade do código
```

### Corrigir problemas automaticamente

```bash
# Formatar código
npm run format

# Corrigir problemas do ESLint
npm run lint:fix

# Ou fazer tudo de uma vez:
npm run format && npm run lint:fix
```

## 🔍 Status do Workflow

Após fazer push ou criar um Pull Request, você pode ver o status do workflow:

1. Vá até a aba **Actions** no GitHub
2. Clique no workflow mais recente
3. Veja os resultados de cada step

### ✅ Se tudo estiver OK
- ✅ Badge verde no PR
- ✅ Pode fazer merge tranquilamente

### ❌ Se houver erros
- ❌ Badge vermelho no PR
- ❌ Veja os logs para identificar o problema
- ❌ Corrija localmente e faça push novamente

## 📝 Dicas

### Antes de fazer commit:
```bash
npm run check  # Verifica formatação + linting
```

### Se der erro no workflow:
```bash
npm run format      # Corrige formatação
npm run lint:fix    # Corrige problemas do ESLint
```

## 🛠️ Configuração

- **Prettier:** `.prettierrc`
- **ESLint:** `eslint.config.mjs`
- **Prettier Ignore:** `.prettierignore`
- **Workflow:** `.github/workflows/code-quality.yml`
