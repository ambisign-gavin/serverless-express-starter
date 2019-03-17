// @flow
import { argv } from 'yargs';
import chalk from 'chalk';
import shell from 'shelljs';
import { spawn } from 'child_process';
import { commandChecker, mkdirAndClone } from './task';

const folderName = argv.path;

export function run() {
    if (!commandChecker(argv)) {
        return;
    }
    mkdirAndClone(argv);
}


