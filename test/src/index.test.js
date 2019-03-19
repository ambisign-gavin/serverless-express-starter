// @flow
import yargs from 'yargs';
import { run } from '../../src';
import execa from 'execa';
import task from '../../src/task';
import inquirerRobot from '../../src/tool/inquirer';

jest.mock('yargs');
jest.mock('execa');
jest.mock('../../src/task');
jest.mock('chalk', () => ({
    red: jest.fn().mockImplementation(text => text),
}));

function spyInquirerRobotDefaultValue() {
    jest.spyOn(inquirerRobot, 'name', 'get').mockReturnValue('my-server');
    jest.spyOn(inquirerRobot, 'pkgManager', 'get').mockReturnValue('npm');
    jest.spyOn(inquirerRobot, 'typeChecker', 'get').mockReturnValue('none');
    jest.spyOn(inquirerRobot, 'isUsedEslint', 'get').mockReturnValue(false);
    jest.spyOn(inquirerRobot, 'run').mockReturnValue(Promise.resolve());
}

describe('Runing command with options', () => {

    beforeAll(() => {
        jest.clearAllMocks();
        jest.spyOn(Object, 'keys').mockReturnValueOnce([
            '1',
            '2',
            '3'
        ]);
    });

    it('should show help when unknow options', async () => {
        
        let log = jest.spyOn(console, 'log');
        await run();
        expect(log.mock.calls.length).toEqual(2);
        expect(log.mock.calls[0][0]).toMatchSnapshot();
        expect(log.mock.calls[1][0]).toMatchSnapshot();
        expect(yargs.showHelp.mock.calls.length).toEqual(1);
    });

});

describe('Runing command without git', () => {

    beforeAll(() => {
        jest.clearAllMocks();
        jest.spyOn(Object, 'keys').mockReturnValueOnce([]);
        execa.shellSync.mockImplementation(() => {
            throw 'Error';
        });
    });

    it('should show error when not installed git', async () => {
        let log = jest.spyOn(console, 'log');
        await run();
        expect(execa.shellSync.mock.calls.length).toEqual(1);
        expect(log.mock.calls.length).toEqual(1);
        expect(log.mock.calls[0][0]).toMatchSnapshot();
    });
    
});

describe('Runing command', () => {

    beforeAll(() => {
        jest.clearAllMocks();
        jest.spyOn(Object, 'keys').mockReturnValueOnce([]);
        execa.shellSync.mockReturnValue();
        spyInquirerRobotDefaultValue();
    });

    it('should init project success', async () => {
        await run();
        expect(inquirerRobot.run.mock.calls.length).toEqual(1);
        expect(task.createFiles.mock.calls.length).toEqual(1);
        expect(task.installPackages.mock.calls.length).toEqual(1);
        expect(task.runExtraSettings.mock.calls.length).toEqual(1);
        expect(task.showCompleteMessages.mock.calls.length).toEqual(1);
    });
    
});