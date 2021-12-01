module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    env: {
        node: true,
        jest: true,
    },
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        'plugin:jest/recommended',
        'prettier',
    ],
    rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.spec.ts'] }],
        'import/extensions': [
            'error',
            {
                ts: 'never',
            },
        ],
        'import/no-import-module-exports': [
            'error',
            {
                // The main export of a package should automatically be excepted, but it is pointing to the built version.
                exceptions: ['**/index.ts'],
            },
        ],
    },
};
