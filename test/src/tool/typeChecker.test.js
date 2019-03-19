// @flow
import typeChecker from '../../../src/tool/typeChecker';
import execa from 'execa';

jest.mock('execa');

describe('TypeChecker', () => {

    it('should generate template path with flow correct', () => {
        expect(typeChecker.generateTemplatePath('flow')).toEqual('template/flow/');
    });

    it('should generate template path with no type checker correct', () => {
        expect(typeChecker.generateTemplatePath('none')).toEqual('template/default/');
    });

    it('should get install packages correct', () => {
        expect(typeChecker.getInstallPackages('flow')).toEqual([
            'flow-bin@^0.95.0',
            'flow-typed@^2.0.0',
            '@babel/preset-flow'
        ]);
    });

    it('should run extra settings correct', () => {
        typeChecker.runExtraSettings('flow', 'path');
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

});
