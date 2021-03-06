// @flow
import task from './task';
import yargs, { argv } from 'yargs';
import execa from 'execa';
import chalk from 'chalk';
import inquirerRobot from './tool/inquirer';

export async function run() {
    if (Object.keys(argv).length > 2) {
        console.log('\nUsage: serverless-express-starter <command>\n');
        console.log('where <command> is one of:\n');
        yargs.showHelp();
        return;
    }
    if (!isRequiredToolHasInstalled()) {
        return;
    }
    await initProject();
}

export async function initProject() {
    await inquirerRobot.run();

    if (inquirerRobot.name.trim().length === 0) {
        console.log(chalk.red('Please enter the project name.'));
        return;
    }
    await task.createFiles(inquirerRobot);
    await task.installPackages(inquirerRobot);
    await task.runExtraSettings(inquirerRobot);
    task.showCompleteMessages();
}

function isRequiredToolHasInstalled(): boolean {
    try {
        execa.shellSync('which git');
    } catch (error) {
        console.log(chalk.red('serverless-express-started need to install git.'));
        return false;
    }
    return true;
}