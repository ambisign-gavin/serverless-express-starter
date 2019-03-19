// @flow
import execa from 'execa';
import task from '../../src/task';
import inquirerRobot from '../../src/tool/inquirer';
import del from 'del';
import fs from 'fs';
import typeChecker from '../../src/tool/typeChecker';
import packageManager from '../../src/tool/packageManager';
import eslint from '../../src/tool/eslint';

jest.mock('execa');
jest.mock('del');
jest.mock('fs');
jest.mock('chalk', () => ({
    green: jest.fn().mockImplementation(text => text)
}));
jest.mock('../../src/tool/eslint');
jest.mock('../../src/tool/typeChecker');
jest.mock('../../src/tool/packageManager');

function spyInquirerRobotDefaultValue() {
    jest.spyOn(inquirerRobot, 'name', 'get').mockReturnValue('my-server');
    jest.spyOn(inquirerRobot, 'pkgManager', 'get').mockReturnValue('npm');
    jest.spyOn(inquirerRobot, 'typeChecker', 'get').mockReturnValue('none');
    jest.spyOn(inquirerRobot, 'isUsedEslint', 'get').mockReturnValue(false);
}

function spyProcessCwd() {
    jest.spyOn(process, 'cwd').mockReturnValue('/test/');
}

describe('Create files task', () => {

    beforeAll(() => {
        spyProcessCwd();
        typeChecker.generateTemplatePath.mockReturnValue('/template/test/');
        packageManager.generatePackageJson.mockReturnValue({
            name: 'my-server',
            main: 'index.js',
            version: '1.0.0',
            description: 'This is my server.',
            scripts: {
                'build': 'babel src/ -d lib/',
            },
            dependencies: {},
            devDependencies: {},
            keywords: [],
        });
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        spyInquirerRobotDefaultValue();
        await task.createFiles(inquirerRobot);
    });

    it('should clone git correct', () => {
        expect(execa.mock.calls.length).toEqual(1);
        expect(execa.mock.calls[0][0]).toEqual('git');
        expect(execa.mock.calls[0][1]).toEqual([
            'clone',
            'https://github.com/ambisign-gavin/serverless-express-starter.git',
            'my-server'
        ]);
    });

    it('should delete files correct', () => {
        expect(del.mock.calls.length).toEqual(2);
        expect(del.mock.calls[0][0]).toEqual([
            '/test/my-server/src',
            '/test/my-server/bin',
            '/test/my-server/.gitignore',
            '/test/my-server/.eslintrc.js',
            '/test/my-server/.flowconfig',
            '/test/my-server/.babelrc',
            '/test/my-server/.git',
            '/test/my-server/package-lock.json',
        ]);
        expect(del.mock.calls[1][0]).toEqual([
            '/test/my-server/template',
        ]);
    });

    it('should copy file correct', () => {
        expect(execa.shellSync.mock.calls.length).toEqual(1);
        expect(execa.shellSync.mock.calls[0][0]).toEqual('cp -a /template/test/. ./');
        expect(execa.shellSync.mock.calls[0][1]).toEqual({
            cwd: '/test/my-server'
        });
    });

    it('should write package.json correct', () => {
        expect(fs.writeFileSync.mock.calls.length).toEqual(1);
        expect(fs.writeFileSync.mock.calls[0][0]).toEqual('/test/my-server/package.json');
        expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
    });

});

describe('Install packages task', () => {

    beforeAll(() => {
        spyProcessCwd();
        typeChecker.getInstallPackages.mockReturnValue([
            'flow-bin@^0.95.0'
        ]);
        eslint.getInstallPackages.mockReturnValue([
            'eslint@^5.0.0'
        ]);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        spyInquirerRobotDefaultValue();
    });

    it('should install correct with no typeChecker', async () => {
        jest.spyOn(inquirerRobot, 'typeChecker', 'get').mockReturnValue('none');
        await task.installPackages(inquirerRobot);
        expect(packageManager.install.mock.calls.length).toEqual(2);
        expect(packageManager.install.mock.calls[0][0]).toEqual('npm');
        expect(packageManager.install.mock.calls[0][1]).toEqual('/test/my-server');
        expect(packageManager.install.mock.calls[0][2]).toEqual([
            'express@^4.0.0',
            'serverless-http@^1.0.0'
        ]);
        expect(packageManager.install.mock.calls[0][3]).toBeFalsy();

        expect(packageManager.install.mock.calls[1][0]).toEqual('npm');
        expect(packageManager.install.mock.calls[1][1]).toEqual('/test/my-server');
        expect(packageManager.install.mock.calls[1][2]).toEqual([
            '@babel/cli@^7.0.0',
            '@babel/core@^7.0.0',
            '@babel/plugin-transform-modules-commonjs@^7.0.0',
            'cli-confirm@^1.0.0',
            'serverless-offline@^4.0.0',
        ]);
        expect(packageManager.install.mock.calls[1][3]).toBeTruthy();
    });

    it('should install correct with typeChecker', async () => {
        jest.spyOn(inquirerRobot, 'typeChecker', 'get').mockReturnValue('flow');
        await task.installPackages(inquirerRobot);
        expect(packageManager.install.mock.calls.length).toEqual(2);
        expect(packageManager.install.mock.calls[0][0]).toEqual('npm');
        expect(packageManager.install.mock.calls[0][1]).toEqual('/test/my-server');
        expect(packageManager.install.mock.calls[0][2]).toEqual([
            'express@^4.0.0',
            'serverless-http@^1.0.0'
        ]);
        expect(packageManager.install.mock.calls[0][3]).toBeFalsy();

        expect(packageManager.install.mock.calls[1][0]).toEqual('npm');
        expect(packageManager.install.mock.calls[1][1]).toEqual('/test/my-server');
        expect(packageManager.install.mock.calls[1][2]).toEqual([
            '@babel/cli@^7.0.0',
            '@babel/core@^7.0.0',
            '@babel/plugin-transform-modules-commonjs@^7.0.0',
            'cli-confirm@^1.0.0',
            'serverless-offline@^4.0.0',
            'flow-bin@^0.95.0'
        ]);
        expect(packageManager.install.mock.calls[1][3]).toBeTruthy();
    });

    it('should install correct with no eslint', async () => {
        jest.spyOn(inquirerRobot, 'isUsedEslint', 'get').mockReturnValue(false);
        await task.installPackages(inquirerRobot);
        expect(packageManager.install.mock.calls.length).toEqual(2);
        expect(packageManager.install.mock.calls[0][0]).toEqual('npm');
        expect(packageManager.install.mock.calls[0][1]).toEqual('/test/my-server');
        expect(packageManager.install.mock.calls[0][2]).toEqual([
            'express@^4.0.0',
            'serverless-http@^1.0.0'
        ]);
        expect(packageManager.install.mock.calls[0][3]).toBeFalsy();

        expect(packageManager.install.mock.calls[1][0]).toEqual('npm');
        expect(packageManager.install.mock.calls[1][1]).toEqual('/test/my-server');
        expect(packageManager.install.mock.calls[1][2]).toEqual([
            '@babel/cli@^7.0.0',
            '@babel/core@^7.0.0',
            '@babel/plugin-transform-modules-commonjs@^7.0.0',
            'cli-confirm@^1.0.0',
            'serverless-offline@^4.0.0',
        ]);
        expect(packageManager.install.mock.calls[1][3]).toBeTruthy();
    });

    it('should install correct with typeChecker', async () => {
        jest.spyOn(inquirerRobot, 'isUsedEslint', 'get').mockReturnValue(true);
        await task.installPackages(inquirerRobot);
        expect(packageManager.install.mock.calls.length).toEqual(2);
        expect(packageManager.install.mock.calls[0][0]).toEqual('npm');
        expect(packageManager.install.mock.calls[0][1]).toEqual('/test/my-server');
        expect(packageManager.install.mock.calls[0][2]).toEqual([
            'express@^4.0.0',
            'serverless-http@^1.0.0'
        ]);
        expect(packageManager.install.mock.calls[0][3]).toBeFalsy();

        expect(packageManager.install.mock.calls[1][0]).toEqual('npm');
        expect(packageManager.install.mock.calls[1][1]).toEqual('/test/my-server');
        expect(packageManager.install.mock.calls[1][2]).toEqual([
            '@babel/cli@^7.0.0',
            '@babel/core@^7.0.0',
            '@babel/plugin-transform-modules-commonjs@^7.0.0',
            'cli-confirm@^1.0.0',
            'serverless-offline@^4.0.0',
            'eslint@^5.0.0'
        ]);
        expect(packageManager.install.mock.calls[1][3]).toBeTruthy();
    });

});

describe('Setting task', () => {

    beforeAll(() => {
        spyProcessCwd();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        spyInquirerRobotDefaultValue();
    });

    it('should setting correct with type checker', async () => {
        jest.spyOn(inquirerRobot, 'typeChecker', 'get').mockReturnValue('flow');
        await task.runExtraSettings(inquirerRobot);
        expect(typeChecker.runExtraSettings.mock.calls.length).toEqual(1);
    });

    it('should setting correct with eslint', async () => {
        jest.spyOn(inquirerRobot, 'isUsedEslint', 'get').mockReturnValue(true);
        await task.runExtraSettings(inquirerRobot);
        expect(eslint.init.mock.calls.length).toEqual(1);
        expect(eslint.injectionParserConfig.mock.calls.length).toEqual(1);
        expect(eslint.fixScripts.mock.calls.length).toEqual(1);
    });

});

describe('Show complete message of task', () => {
    it('should showed correct', () => {
        let log = jest.spyOn(console, 'log');
        task.showCompleteMessages();
        expect(log.mock.calls.length).toEqual(1);
        expect(log.mock.calls[0][0]).toMatchSnapshot();
    });
});
