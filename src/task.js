// @flow
import { type Args } from './type';
import chalk from 'chalk';
import fs, { writeFileSync } from 'fs';
import del from 'del';
import { join } from 'path';
import execa from 'execa';
import inquirerRobot from './inquirer';
import packageManager from './packageManager';
import typeChecker from './typeChecker';

export function commandChecker(args: Args): boolean {
    const prjectName = args.name;
    if (prjectName == undefined || prjectName === '') {
        console.log(chalk.red('Please use --name to spcified location'));
        return false;
    }
    return true;
}

export async function initProject(args: Args) {
    const projectName = args.name;
    
    if(fs.existsSync(projectName)) {
        console.log(chalk.red('Folder is already existed'));
        return;
    }
    await inquirerRobot.run();

    const projectPath = join(process.cwd(), projectName);
    const pkgManagerPlatform = inquirerRobot.pkgManager;
    const typeChackerPlatform = inquirerRobot.typeChecker;

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

    await packageManager.installDefault(pkgManagerPlatform, projectPath);
    await packageManager.install(
        pkgManagerPlatform, 
        projectPath, 
        typeChecker.getInstallPackage(typeChackerPlatform), 
        true
    );
    await typeChecker.runExtraSettings(typeChackerPlatform, projectPath);
}