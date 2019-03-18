module.exports = {
    'env': {
        'es6': true,
        'node': true,
        'jest': true
    },
    'parser': 'babel-eslint',
    'extends': [
        'eslint:recommended',
        'plugin:flowtype/recommended'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'flowtype'
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': 'off'
    }
};