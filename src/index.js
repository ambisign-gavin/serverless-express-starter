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
    let isRequiredTool = await isRequiredToolHasInstalled();
    if (!isRequiredTool) {
        return;
    }
    initProject();
}

async function isRequiredToolHasInstalled(): Promise<boolean> {
    try {
        await execa.shell('which', [
            'git'
        ]);
    } catch (error) {
        console.log(chalk.red('serverless-express-started need installed git.'));
        return false;
    }
    return true;
}