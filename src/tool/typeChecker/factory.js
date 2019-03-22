// @flow
import { type TypeCheckerPlatform } from '../../type';
import { TypeChecker } from './interface';
import { FlowTypeChecker } from './flow';
import { NoneTypeChecker } from './noneChecker';

export const typeCheckerFactory = {
    getTypeChecker(typeCheckerPlatform: TypeCheckerPlatform): TypeChecker {
        switch (typeCheckerPlatform) {
        case 'flow':
            return new FlowTypeChecker();
        default:
            return new NoneTypeChecker();
        }
    }
};