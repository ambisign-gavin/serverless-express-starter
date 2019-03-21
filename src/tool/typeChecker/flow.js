// @flow
import { TypeChecker } from './interface';
import execa from 'execa';

export class FlowTypeChecker implements TypeChecker {
    generateTemplatePath(): string {
        return 'template/flow/';
    }

    getInstallPackages(): Array<string> {
        return [
            'flow-bin@^0.95.0',
            'flow-typed@^2.0.0',
            '@babel/preset-flow'
        ];
    }

    async runExtraSettings(projectPath: string): Promise<void> {
        await execa('flow-typed', [
            'install',
            'express@^4.0.0'
        ], {
            cwd: projectPath
        });
        return;
    }
}