// @flow
import yargs from 'yargs';
import { run } from '../../src';
import execa from 'execa';
import { initProject } from '../../src/task';

jest.mock('yargs');
jest.mock('execa');
jest.mock('../../src/task');
jest.mock('chalk', () => ({
    red: jest.fn().mockImplementation(text => text)
}));

describe('Runing command', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show help when unknow options', async () => {
        jest.spyOn(Object, 'keys').mockReturnValueOnce([
            '1',
            '2',
            '3'
        ]);
        let log = jest.spyOn(console, 'log');
        await run();
        expect(log.mock.calls.length).toEqual(2);
        expect(log.mock.calls[0][0]).toMatchSnapshot();
        expect(log.mock.calls[1][0]).toMatchSnapshot();
        expect(yargs.showHelp.mock.calls.length).toEqual(1);
    });

    it('should show error when not installed git', async () => {
        jest.spyOn(Object, 'keys').mockReturnValueOnce([]);
        execa.shellSync.mockImplementation(() => {
            throw 'Error';
        });
        let log = jest.spyOn(console, 'log');
        await run();
        expect(execa.shellSync.mock.calls.length).toEqual(1);
        expect(log.mock.calls.length).toEqual(1);
        expect(log.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should init project correct', async () => {
        jest.spyOn(Object, 'keys').mockReturnValueOnce([]);
        execa.shellSync.mockReturnValueOnce();
        await run();
        expect(initProject.mock.calls.length).toEqual(1);
    });
});
