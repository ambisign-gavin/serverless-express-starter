// @flow
import { type Args } from './type';
import chalk from 'chalk';
import shell from 'shelljs';
import fs, { writeFileSync } from 'fs';
import del from 'del';
import { join } from 'path';
import execa from 'execa';
import inquirerRobot from './inquirer';
import packageInstaller from './packageManager';

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

    await execa('git', [
        'clone',
        'https://github.com/ambisign-gavin/serverless-express-starter.git',
        projectName
    ]);

    await del([
        join(projectPath, 'src'),
        join(projectPath, 'bin'),
        join(projectPath, '.gitignore'),
        join(projectPath, '.babelrc'),
        join(projectPath, '.git'),
        join(projectPath, 'package-lock.json'),
    ]);
    
    shell.cp('-R', join(projectPath, 'template/default/*'), projectPath);

    await del([
        join(projectPath, 'template'),
    ]);

    const packageContext = packageInstaller.generatePackageJson(
        inquirerRobot.pkgManager,
        projectName,
        inquirerRobot.description
    );

    writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageContext, null, 2) + '\n');

    packageInstaller.install(inquirerRobot.pkgManager, projectPath);
    
}