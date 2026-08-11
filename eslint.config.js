import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      '.output/**',
      'dist/**',
      'node_modules/**',
      'src/routeTree.gen.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // `configs['recommended-latest']` is still the eslintrc shape (plugins as an array of strings);
  // the flat-config equivalent lives under `configs.flat`.
  reactHooks.configs.flat['recommended-latest'],
  prettier,
  {
    rules: {
      // The MDX component map passes through untyped props on purpose.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  }
)
