// @flow

export type Args = {|
    name: string,
|}

export type PackageManagerPlatform = 'npm' | 'yarn';

export type TypeCheckerPlatform = 'none' | 'flow' | 'typescript';