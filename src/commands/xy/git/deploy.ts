import { flags, SfdxCommand } from '@salesforce/command';
import { exec2JSON, exec2String } from '../../../libs/execProm';
import { findMetasByfilename } from '../../../libs/sfutil';

export default class Deploy extends SfdxCommand {
  public static description = 'deploy metadata from git, default use git stage file to build sfdx deploy script';

  public static examples = [
    'sfdx xy:git:deploy',
    'sfdx xy:git:deploy -e',
    'sfdx xy:git:deploy --execute',
    'sfdx xy:git:deploy -c $commit_id',
    'sfdx xy:git:deploy --commitid $commit_id',
    'sfdx xy:git:deploy -a $branch1 -b $branch2',
    'sfdx xy:git:deploy --branch1 $branch1 --branch2 $branch2',
    'sfdx xy:git:deploy --branch1 $branch1 --branch2 $branch2 --execute',
  ];

  protected static flagsConfig = {
    branch1: flags.string({ char: 'a', description: 'branch1 name' }),
    branch2: flags.string({ char: 'b', description: 'branch2 name', default: 'HEAD' }),
    commitid: flags.string({ char: 'c', description: 'commit id' }),
    execute: flags.boolean({ char: 'e', description: 'execute deploy' }),
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    let gitCommand;
    if (this.flags.commitid) {
      gitCommand = `git show --diff-filter=ACMT --pretty="" --name-only ${this.flags.commitid}`;
    } else if (this.flags.branch1 && this.flags.branch2) {
      gitCommand = `git diff --diff-filter=ACMT ${this.flags.branch1}...${this.flags.branch2} --name-only`;
    } else {
      // Added (A), Copied (C), Deleted (D), Modified (M), Renamed (R), changed (T), are Unmerged (U)
      gitCommand = 'git diff HEAD --diff-filter=ACMT --name-only --cached';
    }
    console.log('git command:\n\t', gitCommand, '\n');
    const res = await exec2String(gitCommand);
    if (!res) {
      this.ux.log('Nothing changed!');
      return;
    }

    const metafiles = findMetasByfilename(res.split('\n'));
    if (metafiles.length <= 0) {
      this.ux.log('Not found sfdx metadata!');
      return;
    }

    const metafilesStr = metafiles.join(',');
    const command = `sfdx force:source:deploy -p "${metafilesStr}" --json`;
    console.log('deploy script: \n\t', command, '\n');

    if (this.flags.execute) {
      const conn = await this.org.getConnection();
      this.ux.startSpinner(`deploy to ${conn.instanceUrl}`);
      this.ux.setSpinnerStatus(`running`);
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
