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
}