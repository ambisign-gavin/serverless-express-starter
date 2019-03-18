// @flow
import chalk from 'chalk';
import { writeFileSync } from 'fs';
import del from 'del';
import { join } from 'path';
import execa from 'execa';
import inquirerRobot, { InquirerRobot } from './tool/inquirer';
import packageManager from './tool/packageManager';
import typeChecker from './tool/typeChecker';
import eslint from './tool/eslint';

export async function initProject() {
    await inquirerRobot.run();

    if (inquirerRobot.name.trim().length === 0) {
        console.log(chalk.red('Please enter the project name.'));
        return;
    }
    await createFiles(inquirerRobot);
    await installPackages(inquirerRobot);
    await runExtraSettings(inquirerRobot);
}

async function createFiles(inquirerRobot: InquirerRobot) {
    try {
        const projectName = inquirerRobot.name;
        const projectPath = join(process.cwd(), inquirerRobot.name);
        const pkgManagerPlatform = inquirerRobot.pkgManager;

        await execa('git', [
            'clone',
            'https://github.com/ambisign-gavin/serverless-express-starter.git',
            projectName
        ]);

        await del([
            join(projectPath, 'src'),
            join(projectPath, 'bin'),
            join(projectPath, '.gitignore'),
            join(projectPath, '.eslintrc.js'),
            join(projectPath, '.flowconfig'),
            join(projectPath, '.babelrc'),
            join(projectPath, '.git'),
            join(projectPath, 'package-lock.json'),
        ]);

        execa.shellSync(`cp -a ${typeChecker.generateTemplatePath(inquirerRobot.typeChecker)}. ./`, {
            cwd: projectPath
        });

        await del([
            join(projectPath, 'template'),
        ]);

        const packageContext = packageManager.generatePackageJson(
            pkgManagerPlatform,
            projectName,
            inquirerRobot.description
        );

        writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageContext, null, 2) + '\n');
    } catch (error) {
        console.log('create files error:', error);
    }
    
}

async function installPackages(inquirerRobot: InquirerRobot) {
    try {
        let dependenciesModule = [
            'express@^4.0.0',
            'serverless-http@^1.0.0',
        ];
        
        let devDependenciesModule = [
            '@babel/cli@^7.0.0',
            '@babel/core@^7.0.0',
            '@babel/plugin-transform-modules-commonjs@^7.0.0',
            'cli-confirm@^1.0.0',
            'serverless-offline@^4.0.0',
        ];

        const projectPath = join(process.cwd(), inquirerRobot.name);
        const pkgManagerPlatform = inquirerRobot.pkgManager;
        const typeChackerPlatform = inquirerRobot.typeChecker;

        if (typeChackerPlatform !== 'none') {
            devDependenciesModule.push(...typeChecker.getInstallPackage(typeChackerPlatform));
        }
        
        if (inquirerRobot.isUsedEslint) {
            devDependenciesModule.push(...eslint.getPackages());
        }

        await packageManager.install(
            pkgManagerPlatform,
            projectPath,
            dependenciesModule,
            false,
        );

        await packageManager.install(
            pkgManagerPlatform,
            projectPath,
            devDependenciesModule,
            true,
        );
    } catch (error) {
        console.log('install packages error:', error);
    }
    
}

async function runExtraSettings(inquirerRobot: InquirerRobot) {
    const projectPath = join(process.cwd(), inquirerRobot.name);
    if (inquirerRobot.typeChecker !== 'none') {
        await typeChecker.runExtraSettings(inquirerRobot.typeChecker, projectPath);
    }
    if (inquirerRobot.isUsedEslint) {
        await eslint.init(projectPath);
        eslint.rejectParserConfig(projectPath);
        await eslint.fixScripts(projectPath);
    }
}