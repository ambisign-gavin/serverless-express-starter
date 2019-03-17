// @flow
import inquirer from 'inquirer';

async function inquireDdescription(): any {
    const answers = await inquirer.prompt([
        {
            name: 'description',
            message: 'The project description'
        }
    ]);
    return answers['description'];
}

export class InquirerRobot {
    _description: string = '';

    async run() {
        this._description = await inquireDdescription();
    }

    get description(): string {
        return this._description;
    }
}

const inquirerRobot = new InquirerRobot();

export default inquirerRobot;
