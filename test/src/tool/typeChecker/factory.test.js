// @flow
import { typeCheckerFactory } from '../../../../src/tool/typeChecker/factory';
import { NoneTypeChecker } from '../../../../src/tool/typeChecker/noneChecker';
import { FlowTypeChecker } from '../../../../src/tool/typeChecker/flow';
import { TypeScriptTypeChecker } from '../../../../src/tool/typeChecker/typeScript';

describe('TypeCheckerFactory', () => {
    it('should get flow tpye checker correct', () => {
        const typeChecker = typeCheckerFactory.getTypeChecker('flow');
        expect(typeChecker instanceof FlowTypeChecker).toBeTruthy();
    });

    it('should get typescript tpye checker correct', () => {
        const typeChecker = typeCheckerFactory.getTypeChecker('typescript');
        expect(typeChecker instanceof TypeScriptTypeChecker).toBeTruthy();
    });

    it('should get none tpye checker correct', () => {
        const typeChecker = typeCheckerFactory.getTypeChecker('none');
        expect(typeChecker instanceof NoneTypeChecker).toBeTruthy();
    });
});
