// @flow
import execa from 'execa';
import packageManager from '../../../src/tool/packageManager';

jest.mock('execa');

describe('PackageManager', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should install correct', async () => {
        let packages = [
            'express@^4.0.0',
            'serverless-http@^1.0.0'
        ];
        await packageManager.install(
            'npm',
            'path',
            packages
        );
        expect(execa.mock.calls.length).toEqual(1);
        expect(execa.mock.calls[0][0]).toEqual('npm');
        expect(execa.mock.calls[0][1]).toEqual([
            'add',
            ...packages
        ]);
        expect(execa.mock.calls[0][2]).toEqual({
            cwd: 'path',
            stdio: 'inherit'
        });
    });

    it('should install dev packages correct', async () => {
        let packages = [
            'express@^4.0.0',
            'serverless-http@^1.0.0'
        ];
        await packageManager.install(
            'npm',
            'path',
            packages,
            true
        );
        expect(execa.mock.calls.length).toEqual(1);
        expect(execa.mock.calls[0][0]).toEqual('npm');
        expect(execa.mock.calls[0][1]).toEqual([
            'add',
            '-D',
            ...packages
        ]);
    });

    it('should generate package json with npm correct', async () => {
        let packageJson = packageManager.generatePackageJson(
            'npm',
            'my-server',
            'This is my server.'
        );
        expect(packageJson).toEqual({
            name: 'my-server',
            main: 'index.js',
            version: '1.0.0',
            description: 'This is my server.',
            scripts: {
                'local': 'npm run build && sls offline start',
                'deploy:dev': 'npm run build && serverless deploy --stage dev',
                'confirm:production': 'cli-confirm \' Do you want to deploy production server? \'',
                'deploy:production': 'npm run confirm:production && npm run build && serverless deploy --stage production'
            },
            dependencies: {},
            devDependencies: {},
            keywords: [],
        });
    });

    it('should generate package json with yarn correct', async () => {
        let packageJson = packageManager.generatePackageJson(
            'yarn',
            'my-server',
            'This is my server.'
        );
        expect(packageJson).toEqual({
            name: 'my-server',
            main: 'index.js',
            version: '1.0.0',
            description: 'This is my server.',
            scripts: {
                'local': 'yarn run build && sls offline start',
                'deploy:dev': 'yarn run build && serverless deploy --stage dev',
                'confirm:production': 'cli-confirm \' Do you want to deploy production server? \'',
                'deploy:production': 'yarn run confirm:production && yarn run build && serverless deploy --stage production'
            },
            dependencies: {},
            devDependencies: {},
            keywords: [],
        });
    });
});
