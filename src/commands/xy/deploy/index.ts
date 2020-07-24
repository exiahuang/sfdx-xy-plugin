import { flags, SfdxCommand } from '@salesforce/command';
import * as glob from 'glob';
import { exec2JSON } from '../../../libs/execProm';
import { findMetas } from '../../../libs/sfutil';

export default class Deploy extends SfdxCommand {
    public static description = 'deploy metadata';

    public static examples = [
        'sfdx xy:deploy --keyword hello*.cls',
        'sfdx xy:deploy --keyword hello*.cls --execute',
        'sfdx xy:deploy --keyword hello*.cls --directory force-app --execute',
        'sfdx xy:deploy --keyword hello*.cls --directory force-app --execute --sensitive',
        'sfdx xy:deploy -k hello*.cls',
        'sfdx xy:deploy -k hello*.cls -e',
        'sfdx xy:deploy -k hello*.cls -d force-app -e',
        'sfdx xy:deploy -k hello*.cls -d force-app -e -s',
    ];

    protected static flagsConfig = {
        keyword: flags.string({ char: 'k', required: true, description: 'pattern of keyword.' }),
        directory: flags.string({ char: 'd', description: 'root directory', default: 'force-app' }),
        cwd: flags.string({ char: 'c', description: 'current working directory', default: '.' }),
        nodir: flags.boolean({ char: 'n', description: 'nodir' }),
        sensitive: flags.boolean({ char: 's', description: 'case sensitive'}),
        execute: flags.boolean({ char: 'e', description: 'execute deploy'}),
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = await this.org.getConnection();
        const options = {
            cwd: this.flags.cwd,
            nocase: !this.flags.sensitive,
            nodir: this.flags.nodir,
        };
        const pattern = `${this.flags.directory}/**/${this.flags.keyword}`;
        const files = glob.sync(pattern, options);
        const metafiles = findMetas(files);
        if(metafiles.length <= 0) {
            this.ux.log('Not found metadata! please check your keyword.');
            return;
        }

        const metafilesStr = metafiles.join(',');
        const command = `sfdx force:source:deploy -p "${metafilesStr}" --json`;
        console.log('deploy script: \n\t', command);

        if(this.flags.execute) {
            this.ux.startSpinner(`deploy to ${conn.instanceUrl}`);
            this.ux.setSpinnerStatus(`deploying`);
            const deployResults = await exec2JSON(command);
            if (deployResults.status === 0) {
                this.ux.stopSpinner('done');
            } else if (!this.flags.json) {
                this.ux.logJson(deployResults);
            }
            return deployResults;
        }
    }
}
