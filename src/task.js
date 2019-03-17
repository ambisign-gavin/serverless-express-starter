// @flow
import { type Args } from './type';
import chalk from 'chalk';
import shell from 'shelljs';
import fs, { writeFileSync } from 'fs';
import del from 'del';
import { join } from 'path';
import execa from 'execa';
import inquirerRobot from './inquirer';

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
    ]);
    
    shell.cp('-R', join(projectPath, 'template/default/*'), projectPath);

    await del([
        join(projectPath, 'template'),
    ]);

    const packageContext = {
        name: projectName,
        main: 'index.js',
        version: '1.0.0',
        description: inquirerRobot.description,
        scripts: {
            'build': 'babel src/ -d lib/',
            'local': 'npm run build && sls offline start',
            'deploy:dev': 'npm run build && serverless deploy --stage dev',
            'confirm-production': 'cli-confirm \' Do you want to deploy production server? \'',
            'deploy-production': 'npm run confirm-production && npm run build && serverless deploy --stage production'
        },
        dependencies: {},
        devDependencies: {},
        keywords: [],
    };

    writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageContext, null, 2) + '\n');

    await execa('npm',[
        'install',
        '--save',
        'express@^4.0.0',
        'serverless-http@^1.0.0',
    ], {
        cwd: projectPath,
        stdio: 'inherit'
    });

    await execa('npm',[
        'install',
        '--save-dev',
        '@babel/cli@^7.0.0',
        '@babel/core@^7.0.0',
        '@babel/plugin-transform-modules-commonjs@^7.0.0',
        'cli-confirm@^1.0.0',
        'serverless-offline@^4.0.0',
    ], {
        cwd: projectPath,
        stdio: 'inherit'
    });
    
}