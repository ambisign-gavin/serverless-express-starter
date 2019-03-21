// @flow

export interface TypeChecker {
    generateTemplatePath(): string;
    getInstallPackages(): Array<string>;
    runExtraSettings(projectPath: string): Promise<void>;
}