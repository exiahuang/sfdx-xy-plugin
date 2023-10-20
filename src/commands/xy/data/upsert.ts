import { flags, SfdxCommand } from '@salesforce/command';
import { getStdin } from 'ts-stdin';
import { readFile } from '../../../libs/file';

export default class XyDataUpsert extends SfdxCommand {
  public static description = 'upsert sobject';

  public static examples = [
    'sf xy data upsert --sobject Account --file Account.json --eid Id',
    'sf xy data upsert -s Account -f Account.json --eid Id',
    'echo Account.json | sf xy data upsert -s Account --eid Id',
  ];

  protected static flagsConfig = {
    sobject: flags.string({ char: 's', required: true, description: 'sobject api name.' }),
    file: flags.string({ char: 'f', required: false, description: 'file path' }),
    eid: flags.string({ char: 'e', required: true, description: 'external ID field, or the Id field.' }),
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    const data = this.flags.file ? readFile(this.flags.file) : JSON.parse(await getStdin());
    if (!data) {
      this.ux.error('No data');
      return;
    }

    const conn = await this.org.getConnection();
    this.ux.startSpinner(`start to upsert ${this.flags.sobject}`);
    this.ux.setSpinnerStatus(`running`);
    conn
      .sobject(this.flags.sobject)
      .upsert(data, this.flags.externalId)
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
