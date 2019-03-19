// @flow
import { initProject } from './task';
import yargs, { argv } from 'yargs';
import execa from 'execa';
import chalk from 'chalk';

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
    initProject();
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