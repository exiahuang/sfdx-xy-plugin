import { flags, SfdxCommand } from '@salesforce/command';
import * as glob from 'glob';
import { exec2String } from '../../../libs/execProm';
import { findTestClass } from '../../../libs/sfutil';
import * as path from 'path';

export default class TestRunner extends SfdxCommand {
    public static description = 'bulk apex test runner';

    public static examples = [
        'sfdx xy:test:run --keyword hello* --execute',
        'sfdx xy:test:run -k hello* -e',
    ];

    protected static flagsConfig = {
        keyword: flags.string({ char: 'k', required: true, description: 'pattern of keyword.' }),
        directory: flags.string({ char: 'd', description: 'root directory', default: 'force-app' }),
        sensitive: flags.boolean({ char: 's', description: 'case sensitive'}),
        execute: flags.boolean({ char: 'e', description: 'execute apex test command'}),
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const pattern = `${this.flags.directory}/**/${this.flags.keyword}`;
        const options = {
            nocase: !this.flags.sensitive,
        };
        const files = glob.sync(pattern, options);
        const metafiles = findTestClass(files);
        if(metafiles.length <= 0) {
            this.ux.log('Not found metadata! please check your keyword.');
            return;
        }
        const metafilesStr = metafiles.map(file => path.basename(file).split('.')[0]).join(',');
        const command = `sfdx force:apex:test:run --classnames "${metafilesStr}"`;
        console.log('apex test script: \n\t', command, '\n');

        if(this.flags.execute) {
            const conn = await this.org.getConnection();
            this.ux.startSpinner(`run test in ${conn.instanceUrl}`);
            this.ux.setSpinnerStatus(`running`);
            const deployResults = await exec2String(command);
            console.log(deployResults);
            return deployResults;
        }
    }
}
