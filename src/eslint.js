// @flow
import execa from 'execa';
import fs from 'fs';
import { join } from 'path';

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
        if (fs.existsSync(join(projectPath, '.eslintrc.js'))) {
            let eslintrc: { default: Object, parser: string } = require(join(projectPath, '.eslintrc.js'));
            delete eslintrc['default'];
            eslintrc['parser'] = 'babel-eslint';
            const newEslintrc = 'module.exports = ' + JSON.stringify(eslintrc, null, 4) + '\n';
            fs.writeFileSync(join(projectPath, '.eslintrc.js'), newEslintrc);
        }
    }
}

const eslint = new Eslint();

export default eslint;