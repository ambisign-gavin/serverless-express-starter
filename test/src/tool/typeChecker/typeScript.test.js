// @flow
import { TypeScriptTypeChecker } from '../../../../src/tool/typeChecker/typeScript';

jest.mock('execa');

describe('Flow type checker', () => {

    const typeChecker = new TypeScriptTypeChecker();

    it('should generate template path correct', () => {
        expect(typeChecker.generateTemplatePath()).toEqual('template/typescript/');
    });

    it('should get install packages correct', () => {
        expect(typeChecker.getInstallPackages()).toEqual([
            '@types/aws-lambda@^8.0.0', 
            '@types/express@^4.0.0',
            '@typescript-eslint/eslint-plugin@^1.0.0',
            '@typescript-eslint/parser@^1.0.0',
            'typescript@^3.0.0',
        ]);
    });

    it('should run extra settings correct', async () => {
        await expect(typeChecker.runExtraSettings('path')).toEqual(Promise.resolve());
    });

    it('should injection settings to eslint config correct', () => {
        let config = {
            env: {
                es6: true,
                node: true
            },
            extends: 'eslint:recommended'
        };

        expect(typeChecker.injectSettingsToEslintConfig(config)).toEqual({
            ...config,
            parser: '@typescript-eslint/parser',
            plugins: [
                '@typescript-eslint'
            ],
            extends: [
                'eslint:recommended', 
                'plugin:@typescript-eslint/recommended'
            ]
        });
    });

    it('should get the build script correct', () => {
        expect(typeChecker.getBuildScript()).toEqual('tsc');
    });

});
