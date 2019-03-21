// @flow
import { FlowTypeChecker } from '../../../../src/tool/typeChecker/flow';
import execa from 'execa';

jest.mock('execa');

describe('Flow type checker', () => {

    const typeChecker = new FlowTypeChecker();

    it('should generate template path correct', () => {
        expect(typeChecker.generateTemplatePath()).toEqual('template/flow/');
    });

    it('should get install packages correct', () => {
        expect(typeChecker.getInstallPackages()).toEqual([
            'flow-bin@^0.95.0',
            'flow-typed@^2.0.0',
            '@babel/preset-flow'
        ]);
    });

    it('should run extra settings correct', async () => {
        await typeChecker.runExtraSettings('path');
        expect(execa.mock.calls.length).toEqual(1);
        expect(execa.mock.calls[0][0]).toEqual('flow-typed');
        expect(execa.mock.calls[0][1]).toEqual([
            'install',
            'express@^4.0.0'
        ]);
        expect(execa.mock.calls[0][2]).toEqual({
            cwd: 'path'
        });
    });

    it('should throw exception when run extra settings error', async () => {
        execa.mockReturnValue(Promise.reject('UnknowError'));
        try {
            await typeChecker.runExtraSettings('path');
        } catch (error) {
            expect(error).toEqual('UnknowError');
        }

    });

});
