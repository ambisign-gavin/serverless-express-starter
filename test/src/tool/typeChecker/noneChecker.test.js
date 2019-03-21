// @flow
import { NoneTypeChecker } from '../../../../src/tool/typeChecker/noneChecker';

describe('Flow type checker', () => {

    const typeChecker = new NoneTypeChecker();

    it('should generate template path correct', () => {
        expect(typeChecker.generateTemplatePath()).toEqual('template/default/');
    });

    it('should get install packages correct', () => {
        expect(typeChecker.getInstallPackages()).toEqual([]);
    });

    it('should run extra settings correct', async () => {
        await expect(typeChecker.runExtraSettings('path')).toEqual(Promise.resolve());
    });

});
