import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
	js.configs.recommended,
	prettier,
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'commonjs',
			globals: {
				...globals.node,
				...globals.es2021,
			},
		},
		rules: {
			// Boas práticas
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'no-console': 'off', // Permite console.log (é um bot)
			'prefer-const': 'error',
			'no-var': 'error',

			// Async/Await
			'require-await': 'warn',
			'no-async-promise-executor': 'error',
		},
	},
	{
		ignores: [
			'node_modules/',
			'logs/',
			'logs_console/',
			'src/logs_voz/',
			'transcricoes/',
			'src/transcricoes/',
			'dist/',
			'build/',
		],
	},
]
