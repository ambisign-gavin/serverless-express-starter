// @flow
import { type Args } from './type';
import chalk from 'chalk';
import shell from 'shelljs';
import { spawn } from 'child_process';
import fs from 'fs';
import del from 'del';

export function commandChecker(args: Args): boolean {
    const path = args.path
    if (path == undefined || path === '') {
        console.log(chalk.red('Please use --path to spcified location'));
        return false;
    }
    return true;
}

export async function mkdirAndClone(args: Args) {
    const path = args.path;

    if(fs.existsSync(path)) {
        console.log(chalk.red('Folder is already existed'));
        return;
    }

    spawn('git', [
        'clone',
        'https://github.com/yargs/yargs.git',
        path
    ]);
    await del([
        'bin',
        '.gitignore',
        '.babelrc'
    ])
}