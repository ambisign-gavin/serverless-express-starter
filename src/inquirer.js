// @flow
import inquirer, { type Questions } from 'inquirer';
import { type PackageManagerPlatform, type TypeCheckerPlatform } from './type';

async function inquer(questions: Questions) {
    const answers = await inquirer.prompt([questions]);
    return answers[questions.name];
}

export class InquirerRobot {
    _name: string = '';
    _description: string = '';
    _pkgManager: PackageManagerPlatform = 'npm';
    _typeChecker: TypeCheckerPlatform = 'none';
    _isUsedEslint: boolean = false;

    async run() {
        this._name = await inquer({
            name: 'ProjectName',
            message: 'What\'s name for this project?'
        });

        this._description = await inquer({
            name: 'ProjectDescription',
            message: 'The project description'
        });

        this._pkgManager = await inquer({
            type: 'list',
            name: 'PackageManager',
            message: 'npm or yarn',
            choices: [
                'npm',
                'yarn'
            ]
        });

        this._typeChecker = await inquer({
            type: 'list',
            name: 'TypeChecker',
            message: 'Do you want to use type checker?',
            choices: [
                'none',
                'flow'
            ]
        });

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

    get typeChecker(): TypeCheckerPlatform {
        return this._typeChecker;
    }

    get isUsedEslint(): boolean {
        return this._isUsedEslint;
    }
}

const inquirerRobot = new InquirerRobot();

export default inquirerRobot;
