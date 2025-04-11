module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react'],
	env: {
		browser: true,
		node: true,
	},
	rules: {
		'react/react-in-jsx-scope': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'react/prop-types': 'off',
		'@typescript-eslint/no-explicit-any': 'error', // Disallow usage of any
		'@typescript-eslint/explicit-module-boundary-types': 'error', // Ensure types are explicitly declared
		semi: ['error', 'never'],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
}
