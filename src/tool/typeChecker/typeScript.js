// @flow
import { TypeChecker } from './interface';

export class TypeScriptTypeChecker implements TypeChecker {
    generateTemplatePath(): string {
        return 'template/typescript/';
    }

    getInstallPackages(): Array<string> {
        //need to install aws-lambda to avoid this issue: https://github.com/dougmoscrop/serverless-http/issues/78
        return [
            '@types/aws-lambda@^8.0.0', 
            '@types/express@^4.0.0',
            '@typescript-eslint/eslint-plugin@^1.0.0',
            '@typescript-eslint/parser@^1.0.0',
            'typescript@^3.0.0',
        ];
    }

    runExtraSettings(projectPath: string): Promise<void> {
        return Promise.resolve();
    }

    injectSettingsToEslintConfig(config: Object): Object {        
        let newConfig = {
            ...config,
            parser: '@typescript-eslint/parser',
            plugins: [
                ...this._parseEslintConfigPropertyToArray(config.plugins),
                '@typescript-eslint'
            ],
            extends: [
                ...this._parseEslintConfigPropertyToArray(config.extends),
                'plugin:@typescript-eslint/recommended'
            ]
        };
        return newConfig;
    }

    getBuildScript(): string {
        return 'tsc';
    }

    _parseEslintConfigPropertyToArray(property: ?string | ?Array<string>): Array<string> {
        if (property == null) {
            return [];
        }
        if (Array.isArray(property)) {
            return property;
        }
        return [property];
    }
}