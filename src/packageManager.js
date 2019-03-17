// @flow
import execa from 'execa';
import { type PackageManagerType } from './type';

const dependenciesModule = [
    'express@^4.0.0',
    'serverless-http@^1.0.0',
];

const devDependenciesModule = [
    '@babel/cli@^7.0.0',
    '@babel/core@^7.0.0',
    '@babel/plugin-transform-modules-commonjs@^7.0.0',
    'cli-confirm@^1.0.0',
    'serverless-offline@^4.0.0',
];

class PackageManager {
    async install(packageManager: PackageManagerType, projectPath: string): Promise<void> {
        try {
            await execa(packageManager,[
                'add',
                ...dependenciesModule
            ], {
                cwd: projectPath,
                stdio: 'inherit'
            });
        
            await execa(packageManager,[
                'add',
                '-D',
                ...devDependenciesModule
            ], {
                cwd: projectPath,
                stdio: 'inherit'
            });
        } catch (error) {
            return Promise.reject(error);
        }
        return Promise.resolve();
    }

    generatePackageJson(packageManager: PackageManagerType, name: string, description: string): Object {
        const packageJson = {
            name,
            main: 'index.js',
            version: '1.0.0',
            description,
            scripts: {
                'build': 'babel src/ -d lib/',
                'local': `${packageManager} run build && sls offline start`,
                'deploy:dev': `${packageManager} run build && serverless deploy --stage dev`,
                'confirm:production': 'cli-confirm \' Do you want to deploy production server? \'',
                'deploy:production': `${packageManager} run confirm:production && ${packageManager} run build && serverless deploy --stage production`
            },
            dependencies: {},
            devDependencies: {},
            keywords: [],
        };
        return packageJson;
    }

}

const packageInstaller = new PackageManager();

export default packageInstaller;