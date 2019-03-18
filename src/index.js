// @flow
import { initProject } from './task';
import yargs, { argv } from 'yargs';

export function run() {
    if (Object.keys(argv).length > 2) {
        console.log('\nUsage: serverless-express-starter <command>\n');
        console.log('where <command> is one of:\n');
        yargs.showHelp();
        return;
    }
    initProject();
}