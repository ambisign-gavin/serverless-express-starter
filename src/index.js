// @flow
import { argv } from 'yargs';
import { commandChecker, initProject } from './task';

export function run() {
    if (!commandChecker(argv)) {
        return;
    }
    initProject(argv);
}


