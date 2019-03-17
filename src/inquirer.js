// @flow
import inquirer, { type Questions } from 'inquirer';
import { type PackageManagerType } from './type';

async function inquer(questions: Questions) {
    const answers = await inquirer.prompt([questions]);
    return answers[questions.name];
}

export class InquirerRobot {
    _description: string = '';
    _pkgManager: PackageManagerType = 'npm';

    async run() {
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
    }

    get description(): string {
        return this._description;
    }

    get pkgManager(): PackageManagerType {
        return this._pkgManager;
    }
}

const inquirerRobot = new InquirerRobot();

export default inquirerRobot;
