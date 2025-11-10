import globals from 'globals'
import pluginJs from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import reactPlugin from 'eslint-plugin-react'
import reactNativePlugin from 'eslint-plugin-react-native'
import prettierPlugin from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
    // 1. Les règles de base d'ESLint
    pluginJs.configs.recommended,

    // 2. Configuration pour Prettier (doit être l'un des derniers)
    configPrettier,

    // 3. Configuration du parseur Babel pour gérer JSX et les fonctionnalités modernes
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: ['module:metro-react-native-babel-preset'],
                },
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
    },

    // 4. Configuration pour React
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react: reactPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            'react/prop-types': 'off',
        },
    },

    // 5. Configuration pour React Native
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            'react-native': reactNativePlugin,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                __DEV__: 'readonly',
            },
        },
        rules: {
            ...reactNativePlugin.configs.all.rules,
        },
    },

    // 6. Configuration de Prettier en tant que règle de linting
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    semi: false,
                    trailingComma: 'all',
                    printWidth: 100,
                    tabWidth: 4, // Utiliser la clé standard de Prettier
                },
            ],
        },
    },

    // 7. Définir l'environnement global (Node/RN)
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                'react-native/react-native': true,
            },
        },
    },
]
