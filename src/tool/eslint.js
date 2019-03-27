// @flow
import execa from 'execa';
import fs from 'fs';
import { join } from 'path';
import YAML from 'yaml';

class Eslint {
    getInstallPackages(): Array<string> {
        return [
            'eslint@^5.0.0',
            'babel-eslint@^10.0.0'
        ];
    }

    init(projectPath: string): execa.ExecaChildProcess {
        return execa('node_modules/eslint/bin/eslint.js',[
            '--init'
        ], {
            cwd: projectPath,
            stdio: 'inherit'
        });
    }

    loadConfig(configPath: string): Object {
        let config = {};
        const jsConfig = join(configPath, '.eslintrc.js');
        if (fs.existsSync(jsConfig)) {
            config = require(jsConfig);
        }

        const jsonConfig = join(configPath, '.eslintrc.json');
        if (fs.existsSync(jsonConfig)) {
            config = require(jsonConfig);
        }

        const ymlConfig = join(configPath, '.eslintrc.yml');
        if (fs.existsSync(ymlConfig)) {
            const file = fs.readFileSync(ymlConfig, 'utf8');
            config = YAML.parse(file);
        }
        return config;
    }

    saveConfig(configPath: string, config: Object) {
        const jsConfig = join(configPath, '.eslintrc.js');
        if (fs.existsSync(jsConfig)) {
            const newEslintrc = 'module.exports = ' + JSON.stringify(config, null, 4) + '\n';
            fs.writeFileSync(jsConfig, newEslintrc);
        }

        const jsonConfig = join(configPath, '.eslintrc.json');
        if (fs.existsSync(jsonConfig)) {
            const newEslintrc = JSON.stringify(config, null, 4) + '\n';
            fs.writeFileSync(jsonConfig, newEslintrc);
        }

        const ymlConfig = join(configPath, '.eslintrc.yml');
        if (fs.existsSync(ymlConfig)) {
            const newEslintrc = YAML.stringify(config);
            fs.writeFileSync(ymlConfig, newEslintrc);
        }
    }

    fixScripts(projectPath: string): execa.ExecaChildProcess {
        return execa('node_modules/eslint/bin/eslint.js',[
            '--fix',
            './src/*.js'
        ], {
            cwd: projectPath,
            stdio: 'inherit'
        });
    }

}

const eslint = new Eslint();

export default eslint;