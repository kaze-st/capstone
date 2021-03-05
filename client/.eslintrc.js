module.exports = {
	extends: [
		'airbnb-typescript',
		'airbnb/hooks',
		'plugin:@typescript-eslint/recommended',
		'plugin:jest/recommended',
		'prettier',
		'prettier/react',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended'
	],
	plugins: ['react', '@typescript-eslint', 'jest'],
	env: {
		browser: true,
		es6: true,
		jest: true
	},
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2018,
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.eslint.json'],
		tsconfigRootDir: __dirname
	},
	rules: {
		'no-param-reassign': ['error', { props: false }],
		'import/order': 0,
		'linebreak-style': 'off',
		'no-console': 1,
		indent: ['error', 'tab'],
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto'
			}
		]
	}
};
