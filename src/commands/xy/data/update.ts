import { flags, SfdxCommand } from '@salesforce/command';
import { getStdin } from 'ts-stdin';
import { readFile } from '../../../libs/file';

export default class XyDataUpdate extends SfdxCommand {
  public static description = 'update sobject';

  public static examples = [
    'sf xy data update --sobject Account --file Account.json',
    'sf xy data update -s Account -f Account.json',
    'echo Account.json | sf xy data update -s Account',
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
    this.ux.startSpinner(`start to update ${this.flags.sobject}`);
    this.ux.setSpinnerStatus(`running`);
    conn
      .sobject(this.flags.sobject)
      .update(data)
      .then((res) => {
        this.ux.stopSpinner('done');
        this.ux.logJson(res);
      })
      .catch((error) => {
        this.ux.stopSpinner('done');
        this.ux.errorJson(error);
      });
  }
}
