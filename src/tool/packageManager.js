// @flow
import execa from 'execa';
import { type PackageManagerPlatform } from '../type';

class PackageManager {
    async install(packageManager: PackageManagerPlatform, projectPath: string, packages: Array<string>, isDev: boolean = false): Promise<void> {
        try {
            const commands = [
                ...packages
            ];
            if (isDev) {
                commands.unshift('-D');
            }
            await execa(packageManager,[
                'add',
                ...commands
            ], {
                cwd: projectPath,
                stdio: 'inherit'
            });
        } catch (error) {
            return Promise.reject(error);
        }
        return Promise.resolve();
    }
    generatePackageJson(packageManager: PackageManagerPlatform, name: string, description: string): Object {
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

const packageManager = new PackageManager();

export default packageManager;