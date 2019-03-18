// @flow
import { type TypeCheckerPlatform } from '../type';
import execa from 'execa';

class TypeChecker {
    generateTemplatePath(typeCheckerPlatform: TypeCheckerPlatform): string {
        switch (typeCheckerPlatform) {
        case 'none':
            return 'template/default/';
        case 'flow':
            return 'template/flow/';
        default:
            return 'template/default/';
        }
    }

    getInstallPackages(typeCheckerPlatform: TypeCheckerPlatform): Array<string> {
        if (typeCheckerPlatform === 'flow') {
            return [
                'flow-bin@^0.95.0',
                'flow-typed@^2.0.0',
                '@babel/preset-flow'
            ];
        }
        return [];
    }
    
    runExtraSettings(typeCheckerPlatform: TypeCheckerPlatform, projectPath: string): execa.ExecaChildProcess {
        if (typeCheckerPlatform === 'flow') {
            return execa('flow-typed', [
                'install',
                'express@^4.0.0'
            ], {
                cwd: projectPath
            });
        }
    }
}

const typeChecker = new TypeChecker();

export default typeChecker;