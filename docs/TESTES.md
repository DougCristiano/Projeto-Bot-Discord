# 🧪 Testes do Projeto

## 📋 Configuração

O projeto usa **Jest** como framework de testes.

### Arquivos de Configuração

- **`jest.config.js`** - Configuração do Jest
- **`__tests__/`** - Pasta com todos os testes

## 🚀 Como Executar

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch (re-executa ao salvar)

```bash
npm run test:watch
```

### Executar testes com relatório de cobertura

```bash
npm run test:coverage
```

## 📊 Relatório de Cobertura

Após rodar `npm run test:coverage`, um relatório HTML é gerado em:

```
coverage/lcov-report/index.html
```

Abra no navegador para ver detalhes da cobertura de código.

## 📝 Tipos de Testes

### 1. **Testes de Comandos** (`__tests__/commands.test.js`)

Valida as FUNCIONALIDADES REAIS dos comandos:

- ✅ **Autocomplete** - Testa se o autocomplete responde corretamente
- ✅ **Execução de comandos** - Verifica processamento de logs
- ✅ **Filtros** - Testa filtro por canal específico
- ✅ **Apelidos** - Valida exibição de nicknames do servidor
- ✅ **Robustez** - Tratamento de erros (JSON inválido, campos ausentes)
- ✅ **Comandos básicos** - Verifica estrutura de /entrar, /sair, /enviar

**27 testes cobrindo funcionalidades reais do bot!**

### 2. **Testes de Logging** (`__tests__/logging-system.test.js`)

Valida o SISTEMA DE LOGGING de atividades de voz:

- ✅ Formato de nome de arquivos (YYYY-MM-DD_atividade_voz.json)
- ✅ Timezone correto (America/Sao_Paulo - Brasil/RJ)
- ✅ Estrutura de logs de entrada, saída e mudança
- ✅ Validação de tipos de dados
- ✅ Persistência em JSON
- ✅ Sistema de apelidos/nicknames

## ✍️ Escrevendo Novos Testes

### Estrutura básica

```javascript
describe('Nome do Grupo de Testes', () => {
	test('descrição do que está testando', () => {
		// Arrange (preparar)
		const valor = 10

		// Act (executar)
		const resultado = valor + 5

		// Assert (verificar)
		expect(resultado).toBe(15)
	})
})
```

### Matchers comuns do Jest

```javascript
// Igualdade
expect(value).toBe(expected) // Igualdade estrita (===)
expect(value).toEqual(expected) // Igualdade profunda (objetos)

// Existência
expect(value).toBeDefined()
expect(value).toBeNull()
expect(value).toBeTruthy()
expect(value).toBeFalsy()

// Números
expect(value).toBeGreaterThan(3)
expect(value).toBeLessThan(5)

// Propriedades
expect(obj).toHaveProperty('key')
expect(obj).toHaveProperty('key', value)

// Strings
expect(str).toMatch(/regex/)
expect(str).toContain('substring')

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)
```

## 🎯 Boas Práticas

### 1. **Testes devem ser independentes**

Cada teste deve poder rodar sozinho, sem depender de outros.

### 2. **Use describe para agrupar**

```javascript
describe('Sistema de Logs', () => {
	describe('Validação de entrada', () => {
		test('deve validar formato de data', () => {
			// ...
		})
	})

	describe('Formatação de saída', () => {
		test('deve formatar JSON corretamente', () => {
			// ...
		})
	})
})
```

### 3. **Nomes descritivos**

```javascript
// ❌ Ruim
test('teste 1', () => {})

// ✅ Bom
test('deve retornar erro quando data está inválida', () => {})
```

### 4. **Teste casos de erro**

```javascript
test('deve lançar erro quando arquivo não existe', () => {
	expect(() => {
		readNonExistentFile()
	}).toThrow()
})
```

## 📈 Meta de Cobertura

Idealmente, o projeto deve ter:

- ✅ **80%+** de cobertura de linhas
- ✅ **70%+** de cobertura de branches
- ✅ **80%+** de cobertura de funções

## 🔧 Integração com CI/CD

Os testes são executados automaticamente no GitHub Actions em:

- ✅ Todo push para `main` ou `develop`
- ✅ Todo Pull Request

Veja: `.github/workflows/code-quality.yml`

## 💡 Dicas

### Mockar Discord.js em testes

Para testar comandos do Discord sem conectar ao servidor:

```javascript
// Mock básico
jest.mock('discord.js', () => ({
	Client: jest.fn(),
	GatewayIntentBits: {},
	Collection: jest.fn(() => new Map()),
}))
```

### Executar apenas um teste

```bash
# Por arquivo
npm test structure.test.js

# Por nome
npm test -- -t "arquivo .env.example deve existir"
```

### Debug de testes

```javascript
test('debug test', () => {
	console.log('Valor:', value)
	expect(value).toBe(expected)
})
```

## 📚 Referências

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
