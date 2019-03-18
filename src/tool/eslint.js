// @flow
import execa from 'execa';
import fs from 'fs';
import { join } from 'path';
import YAML from 'yaml';

class Eslint {
    getPackages(): Array<string> {
        return [
            'eslint@^5.0.0',
            'babel-eslint@^10.0.0'
        ];
    }

    async init(projectPath: string): execa.ExecaChildProcess {
        return execa('node_modules/eslint/bin/eslint.js',[
            '--init'
        ], {
            cwd: projectPath,
            stdio: 'inherit'
        });
    }

    rejectParserConfig(projectPath: string) {
        const jsConfig = join(projectPath, '.eslintrc.js');
        if (fs.existsSync(jsConfig)) {
            let eslintrc: { default: Object, parser: string } = require(jsConfig);
            delete eslintrc['default'];
            eslintrc['parser'] = 'babel-eslint';
            const newEslintrc = 'module.exports = ' + JSON.stringify(eslintrc, null, 4) + '\n';
            fs.writeFileSync(jsConfig, newEslintrc);
        }

        const jsonConfig = join(projectPath, '.eslintrc.json');
        if (fs.existsSync(jsonConfig)) {
            let eslintrc = require(jsonConfig);
            eslintrc = {
                ...eslintrc,
                parser: 'babel-eslint'
            };
            const newEslintrc = JSON.stringify(eslintrc, null, 4) + '\n';
            fs.writeFileSync(jsonConfig, newEslintrc);
        }

        const ymlConfig = join(projectPath, '.eslintrc.yml');
        if (fs.existsSync(ymlConfig)) {
            const file = fs.readFileSync(ymlConfig, 'utf8');
            let eslintrc = YAML.parse(file);
            eslintrc = {
                ...eslintrc,
                parser: 'babel-eslint'
            };
            const newEslintrc = YAML.stringify(eslintrc);
            fs.writeFileSync(ymlConfig, newEslintrc);
        }
    }
}

const eslint = new Eslint();

export default eslint;