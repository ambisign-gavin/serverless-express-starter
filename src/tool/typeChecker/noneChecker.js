// @flow
import { TypeChecker } from './interface';

export class NoneTypeChecker implements TypeChecker {
    generateTemplatePath(): string {
        return 'template/default/';
    }

    getInstallPackages(): Array<string> {
        return [];
    }

    runExtraSettings(projectPath: string): Promise<void> {
        return Promise.resolve();
    }

    injectSettingsToEslintConfig(config: Object): Object {
        let newConfig = {
            ...config,
            parser: 'babel-eslint'
        };
        return newConfig;
    }

    getBuildScript(): string {
        return 'babel src/ -d lib/';
    }
}