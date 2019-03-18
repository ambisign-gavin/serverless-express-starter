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

    it('should injection parser to js config correct', () => {
        const path = join(process.cwd(), 'test/configs');
        fs.existsSync.mockImplementation((path) => {
            return /.*(js)$/.test(path);
        });
        eslint.rejectParserConfig(path);
        expect(fs.writeFileSync.mock.calls.length).toEqual(1);
        expect(fs.writeFileSync.mock.calls[0][0]).toEqual(join(path, '.eslintrc.js'));
        expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
    });

    it('should injection parser to json config correct', () => {
        const path = join(process.cwd(), 'test/configs');
        fs.existsSync.mockImplementation((path) => {
            return /.*(json)$/.test(path);
        });
        eslint.rejectParserConfig(path);
        expect(fs.writeFileSync.mock.calls.length).toEqual(1);
        expect(fs.writeFileSync.mock.calls[0][0]).toEqual(join(path, '.eslintrc.json'));
        expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
    });

    it('should injection parser to yaml config correct', () => {
        const path = join(process.cwd(), 'test/configs');
        fs.existsSync.mockImplementation((path) => {
            return /.*(yml)$/.test(path);
        });
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
        eslint.rejectParserConfig(path);
        expect(fs.writeFileSync.mock.calls.length).toEqual(1);
        expect(fs.writeFileSync.mock.calls[0][0]).toEqual(join(path, '.eslintrc.yml'));
        expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
    });

    it('should fix scripts correct', () => {
        eslint.fixScripts('path');
        expect(execa.mock.calls.length).toEqual(1);
        expect(execa.mock.calls[0][0]).toEqual('node_modules/eslint/bin/eslint.js');
        expect(execa.mock.calls[0][1]).toEqual([
            '--fix',
            './src/*.js'
        ]);
        expect(execa.mock.calls[0][2]).toEqual({
            cwd: 'path',
            stdio: 'inherit'
        });
    });

});
