import { flags, SfdxCommand } from '@salesforce/command';
import { getStdin } from 'ts-stdin';
import { readFile } from '../../../libs/file';

export default class XyDataDelete extends SfdxCommand {
  public static description = 'delete sobject';

  public static examples = [
    'sf xy data delete --sobject Account --file Account.json',
    'sf xy data delete -s Account -f Account.json',
    'echo Account.json | sf xy data delete -s Account',
  ];

  protected static flagsConfig = {
    sobject: flags.string({ char: 's', required: true, description: 'sobject api name.' }),
    file: flags.string({ char: 'f', required: false, description: 'file path' }),
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    const data = this.flags.file ? readFile(this.flags.file) : JSON.parse(await getStdin());
    if (!data) {
      this.ux.error('No data');
      return;
    }

    const conn = await this.org.getConnection();
    this.ux.startSpinner(`start to delete ${this.flags.sobject}`);
    this.ux.setSpinnerStatus(`running`);
    conn
      .sobject(this.flags.sobject)
      .del(data)
      .then((res) => {
        this.ux.stopSpinner('done');
        this.ux.logJson(res);
      })
      .catch((error) => {
        this.ux.stopSpinner('done');
        this.ux.logJson(error);
      });
  }
}
