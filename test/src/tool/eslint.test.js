// @flow
import eslint from '../../../src/tool/eslint';
import execa from 'execa';
import { join } from 'path';
import fs from 'fs';
import YAML from 'yaml';

jest.mock('execa');
jest.mock('fs');

describe('Eslint', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get install packages correct', () => {
        expect(eslint.getInstallPackages()).toEqual([
            'eslint@^5.0.0',
            'babel-eslint@^10.0.0'
        ]);
    });

    it('should init eslint correct', () => {
        eslint.init('path');
        expect(execa.mock.calls.length).toEqual(1);
        expect(execa.mock.calls[0][0]).toEqual('node_modules/eslint/bin/eslint.js');
        expect(execa.mock.calls[0][1]).toEqual([
            '--init'
        ]);
        expect(execa.mock.calls[0][2]).toEqual({
            cwd: 'path',
            stdio: 'inherit'
        });
    });

    it('should fix scripts correct', () => {
        eslint.fixScripts('path');
        expect(execa.mock.calls.length).toEqual(1);
        expect(execa.mock.calls[0][0]).toEqual('node_modules/eslint/bin/eslint.js');
        expect(execa.mock.calls[0][1]).toEqual([
            '--fix',
            './src/*'
        ]);
        expect(execa.mock.calls[0][2]).toEqual({
            cwd: 'path',
            stdio: 'inherit'
        });
    });

});

describe('Eslint with js config', () => {

    const path = join(process.cwd(), 'test/configs');

    beforeAll(() => {
        fs.existsSync.mockImplementation((path) => {
            return /.*(js)$/.test(path);
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should load correct', () => {
        let config = eslint.loadConfig(path);
        expect(config).toEqual({
            env: {
                es6: true,
                node: true
            },
            extends: 'eslint:recommended',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {}
        });
    });

    it('should save correct', () => {
        let config = {
            env: {
                es6: true,
                node: true
            },
            extends: 'eslint:recommended',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {},
            parser: 'babel-eslint'
        };
        eslint.saveConfig(path, config);
        expect(fs.writeFileSync.mock.calls.length).toEqual(1);
        expect(fs.writeFileSync.mock.calls[0][0]).toEqual(join(path, '.eslintrc.js'));
        expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
    });

});

describe('Eslint with json config', () => {

    const path = join(process.cwd(), 'test/configs');

    beforeAll(() => {
        fs.existsSync.mockImplementation((path) => {
            return /.*(json)$/.test(path);
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should load correct', () => {
        let config = eslint.loadConfig(path);
        expect(config).toEqual({
            env: {
                es6: true,
                node: true
            },
            extends: 'eslint:recommended',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {}
        });
    });

    it('should save correct', () => {
        let config = {
            env: {
                es6: true,
                node: true
            },
            extends: 'eslint:recommended',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {},
            parser: 'babel-eslint'
        };
        eslint.saveConfig(path, config);
        expect(fs.writeFileSync.mock.calls.length).toEqual(1);
        expect(fs.writeFileSync.mock.calls[0][0]).toEqual(join(path, '.eslintrc.json'));
        expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
    });

});

describe('Eslint with yml config', () => {

    const path = join(process.cwd(), 'test/configs');

    beforeAll(() => {
        fs.existsSync.mockImplementation((path) => {
            return /.*(yml)$/.test(path);
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should load correct', () => {
        jest.spyOn(YAML, 'parse').mockReturnValue({
            env: {
                es6: true,
                node: true
            },
            extends: 'eslint:recommended',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {}
        });

        let config = eslint.loadConfig(path);
        expect(config).toEqual({
            env: {
                es6: true,
                node: true
            },
            extends: 'eslint:recommended',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {}
        });
    });

    it('should save correct', () => {
        let config = {
            env: {
                es6: true,
                node: true
            },
            extends: 'eslint:recommended',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {},
            parser: 'babel-eslint'
        };
        eslint.saveConfig(path, config);
        expect(fs.writeFileSync.mock.calls.length).toEqual(1);
        expect(fs.writeFileSync.mock.calls[0][0]).toEqual(join(path, '.eslintrc.yml'));
        expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
    });

});


