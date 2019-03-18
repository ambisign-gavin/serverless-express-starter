// @flow
import inquirer from 'inquirer';
import inquirerRobot from '../../../src/tool/inquirer';
import fs from 'fs';

jest.mock('inquirer');
jest.mock('fs');

describe('Inquirer', () => {
    beforeAll(() => {
        jest.resetAllMocks();
        inquirer.prompt.mockImplementation(([questions]) => {
            return Promise.resolve({
                [questions.name]: questions.name
            });
        });
        inquirerRobot.run();
    });

    it('should questions number be correct', () => {
        expect(inquirer.prompt.mock.calls.length).toEqual(5);
    });

    it('should pass name question correct', () => {
        fs.existsSync.mockReturnValueOnce(true);
        fs.existsSync.mockReturnValueOnce(false);
        expect(inquirer.prompt.mock.calls[0][0][0].name).toEqual('ProjectName');
        expect(inquirer.prompt.mock.calls[0][0][0].message).toEqual('How to name this mighty project?');
        expect(inquirer.prompt.mock.calls[0][0][0].validate('my-serverless')).toEqual('This amazing name already exists.');
        expect(inquirer.prompt.mock.calls[0][0][0].validate('my-serverless')).toEqual(true);
    });

    it('should pass description question correct', () => {
        expect(inquirer.prompt.mock.calls[1][0]).toEqual([{
            name: 'ProjectDescription',
            message: 'How to describe this mighty project?'
        }]);
    });

    it('should pass package manager question correct', () => {
        expect(inquirer.prompt.mock.calls[2][0]).toEqual([{
            type: 'list',
            name: 'PackageManager',
            message: 'Will this project use npm or yarn?',
            choices: [
                'npm',
                'yarn'
            ]
        }]);
    });

    it('should pass type checker question correct', () => {
        expect(inquirer.prompt.mock.calls[3][0]).toEqual([{
            type: 'list',
            name: 'TypeChecker',
            message: 'Do you want to use type checker?',
            choices: [
                'none',
                'flow'
            ]
        }]);
    });

    it('should pass eslint question correct', () => {
        expect(inquirer.prompt.mock.calls[4][0]).toEqual([{
            type: 'confirm',
            name: 'UseEslint',
            message: 'Do you want to use eslint?'
        }]);
    });

});
