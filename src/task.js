// @flow
import chalk from 'chalk';
import { writeFileSync } from 'fs';
import del from 'del';
import { join } from 'path';
import execa from 'execa';
import { InquirerRobot } from './tool/inquirer';
import packageManager from './tool/packageManager';
import eslint from './tool/eslint';

class Task {
    async createFiles(inquirerRobot: InquirerRobot) {
        try {
            const projectName = inquirerRobot.name;
            const projectPath = join(process.cwd(), inquirerRobot.name);
            const pkgManagerPlatform = inquirerRobot.pkgManager;
            const typeChecker = inquirerRobot.typeChecker;
    
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
    
            execa.shellSync(`cp -a ${typeChecker.generateTemplatePath()}. ./`, {
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
            console.log('An error occurred while creating files:', error);
        }
        
    }
    
    async installPackages(inquirerRobot: InquirerRobot) {
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
            const typeChecker = inquirerRobot.typeChecker;
    
            if (typeChecker.getInstallPackages().length > 0) {
                devDependenciesModule.push(...typeChecker.getInstallPackages());
            }
            
            if (inquirerRobot.isUsedEslint) {
                devDependenciesModule.push(...eslint.getInstallPackages());
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
            console.log('An error occurred while installing packages:', error);
        }
        
    }
    
    async runExtraSettings(inquirerRobot: InquirerRobot) {
        try {
            const projectPath = join(process.cwd(), inquirerRobot.name);
            const typeChecker = inquirerRobot.typeChecker;

            await typeChecker.runExtraSettings(projectPath);

            if (inquirerRobot.isUsedEslint) {
                await eslint.init(projectPath);
                eslint.injectionParserConfig(projectPath);
                await eslint.fixScripts(projectPath);
            }
        } catch (error) {
            console.log('An error occurred while setting plugins:', error);
        }
        
    }
    
    showCompleteMessages() {
        const messages = `
It's all done! You can start to develop your mighty project!

You can use:

  npm/yarn run local               Run the local server.
  npm/yarn run deploy:dev          Deploy the server of dev stage.
  npm/yarn run deploy:production   Deploy the server of production stage.

Enjoy it!
        `;
        console.log(chalk.green(messages));
    }
}

const task = new Task();

export default task;