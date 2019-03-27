// @flow
import { type TypeCheckerPlatform } from '../../type';
import { TypeChecker } from './interface';
import { FlowTypeChecker } from './flow';
import { NoneTypeChecker } from './noneChecker';
import { TypeScriptTypeChecker } from './typeScript';

export const typeCheckerFactory = {
    getTypeChecker(typeCheckerPlatform: TypeCheckerPlatform): TypeChecker {
        switch (typeCheckerPlatform) {
        case 'flow':
            return new FlowTypeChecker();
        case 'typescript':
            return new TypeScriptTypeChecker();
        default:
            return new NoneTypeChecker();
        }
    }
};