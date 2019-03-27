// @flow
import inquirer, { type Questions } from 'inquirer';
import { type PackageManagerPlatform } from '../type';
import { existsSync } from 'fs';
import { join } from 'path';
import { TypeChecker } from './typeChecker/interface';
import { NoneTypeChecker } from './typeChecker/noneChecker';
import { typeCheckerFactory } from './typeChecker/factory';

async function inquer(questions: Questions) {
    const answers = await inquirer.prompt([questions]);
    return answers[questions.name];
}

export class InquirerRobot {
    _name: string = '';
    _description: string = '';
    _pkgManager: PackageManagerPlatform = 'npm';
    _typeChecker: TypeChecker = new NoneTypeChecker();
    _isUsedEslint: boolean = false;

    async run() {
        this._name = await inquer({
            name: 'ProjectName',
            message: 'How to name this mighty project?',
            validate: (name) => {
                if(existsSync(join(process.cwd(), name))) {
                    return 'This amazing name already exists.';
                }
                return true;
            }
        });

        this._description = await inquer({
            name: 'ProjectDescription',
            message: 'How to describe this mighty project?'
        });

        this._pkgManager = await inquer({
            type: 'list',
            name: 'PackageManager',
            message: 'Will this project use npm or yarn?',
            choices: [
                'npm',
                'yarn'
            ]
        });

        this._typeChecker = typeCheckerFactory.getTypeChecker(await inquer({
            type: 'list',
            name: 'TypeChecker',
            message: 'Do you want to use type checker?',
            choices: [
                'none',
                'flow',
                'typescript'
            ]
        }));

        this._isUsedEslint = await inquer({
            type: 'confirm',
            name: 'UseEslint',
            message: 'Do you want to use eslint?'
        });
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get pkgManager(): PackageManagerPlatform {
        return this._pkgManager;
    }

    get typeChecker(): TypeChecker {
        return this._typeChecker;
    }

    get isUsedEslint(): boolean {
        return this._isUsedEslint;
    }
}

const inquirerRobot = new InquirerRobot();

export default inquirerRobot;
