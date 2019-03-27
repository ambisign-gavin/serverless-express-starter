// @flow
import execa from 'execa';
import task from '../../src/task';
import inquirerRobot from '../../src/tool/inquirer';
import del from 'del';
import fs from 'fs';
import packageManager from '../../src/tool/packageManager';
import eslint from '../../src/tool/eslint';
import { TypeChecker } from '../../src/tool/typeChecker/interface';

jest.mock('execa');
jest.mock('del');
jest.mock('fs');
jest.mock('chalk', () => ({
    green: jest.fn().mockImplementation(text => text)
}));
jest.mock('../../src/tool/eslint');
jest.mock('../../src/tool/packageManager');

let typeChecker: TypeChecker;

function spyInquirerRobotDefaultValue() {
    typeChecker = {
        generateTemplatePath: jest.fn(),
        getInstallPackages: jest.fn(),
        runExtraSettings: jest.fn(),
        injectSettingsToEslintConfig: jest.fn(),
        getBuildScript: jest.fn(),
    };
    jest.spyOn(inquirerRobot, 'name', 'get').mockReturnValue('my-server');
    jest.spyOn(inquirerRobot, 'pkgManager', 'get').mockReturnValue('npm');
    jest.spyOn(inquirerRobot, 'typeChecker', 'get').mockReturnValue(typeChecker);
    jest.spyOn(inquirerRobot, 'isUsedEslint', 'get').mockReturnValue(false);
}

function spyProcessCwd() {
    jest.spyOn(process, 'cwd').mockReturnValue('/test/');
}

describe('Create files task', () => {

    beforeAll(() => {
        spyProcessCwd();
        packageManager.generatePackageJson.mockReturnValue({
            name: 'my-server',
            main: 'index.js',
            version: '1.0.0',
            description: 'This is my server.',
            scripts: {
                'test': 'echo test',
            },
            dependencies: {},
            devDependencies: {},
            keywords: [],
        });
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        spyInquirerRobotDefaultValue();
        typeChecker.generateTemplatePath.mockReturnValue('/template/test/');
        typeChecker.getBuildScript.mockReturnValue('babel src/ -d lib/');
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
            '/test/my-server/flow-typed',
            '/test/my-server/test',
            '/test/my-server/.npmignore',
            '/test/my-server/demo.gif',
            '/test/my-server/jest.config.js',
            '/test/my-server/LICENSE',
            '/test/my-server/README.md',
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
        eslint.getInstallPackages.mockReturnValue([
            'eslint@^5.0.0'
        ]);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        spyInquirerRobotDefaultValue();
    });

    it('should install correct with no typeChecker', async () => {
        typeChecker.getInstallPackages.mockReturnValue([]);
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
        typeChecker.getInstallPackages.mockReturnValue(['flow-bin@^0.95.0']);
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
        typeChecker.getInstallPackages.mockReturnValue([]);
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

    it('should install correct with eslint', async () => {
        typeChecker.getInstallPackages.mockReturnValue([]);
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

    it('should run type checker settings correct', async () => {
        await task.runExtraSettings(inquirerRobot);
        expect(typeChecker.runExtraSettings.mock.calls.length).toEqual(1);
    });

    it('should init eslint correct', async () => {
        jest.spyOn(inquirerRobot, 'isUsedEslint', 'get').mockReturnValue(true);
        await task.runExtraSettings(inquirerRobot);
        expect(eslint.init.mock.calls.length).toEqual(1);
    });

    it('should use eslint to fix scripts correct', async () => {
        jest.spyOn(inquirerRobot, 'isUsedEslint', 'get').mockReturnValue(true);
        await task.runExtraSettings(inquirerRobot);
        expect(eslint.fixScripts.mock.calls.length).toEqual(1);
    });

    it('should inject type checker settings to eslint config correct', async () => {
        let loadConfigReturned = {
            env: {
                es6: true,
                node: true
            }
        };
        let injectSettingsToEslintConfigReturned = {
            env: {
                es6: true,
                node: true
            },
            parser: 'babel-parser',
        };
        eslint.loadConfig.mockReturnValue(loadConfigReturned);
        typeChecker.injectSettingsToEslintConfig.mockReturnValue(injectSettingsToEslintConfigReturned);
        jest.spyOn(inquirerRobot, 'isUsedEslint', 'get').mockReturnValue(true);

        await task.runExtraSettings(inquirerRobot);
        expect(eslint.loadConfig.mock.calls.length).toEqual(1);
        expect(typeChecker.injectSettingsToEslintConfig.mock.calls.length).toEqual(1);
        expect(typeChecker.injectSettingsToEslintConfig.mock.calls[0][0]).toEqual(loadConfigReturned);
        expect(eslint.saveConfig.mock.calls.length).toEqual(1);
        expect(eslint.saveConfig.mock.calls[0][1]).toEqual(injectSettingsToEslintConfigReturned);
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
