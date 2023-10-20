import { flags, SfdxCommand } from '@salesforce/command';

export default class XyDataSearch extends SfdxCommand {
  public static description = 'search sobject';

  public static examples = [
    'sf xy data search --sobject Account --key "Un*"',
    'sf xy data search -s Account -k "{Un*}"',
  ];

  protected static flagsConfig = {
    sobject: flags.string({ char: 's', required: true, description: 'sobject api name.' }),
    fields: flags.string({ required: false, description: 'fields.' }),
    key: flags.string({ char: 'k', required: true, description: 'keyword.' }),
    print: flags.boolean({ required: false, description: 'print sosl.' }),
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    const conn = await this.org.getConnection();
    this.ux.startSpinner(`start to query`);
    this.ux.setSpinnerStatus(`running`);
    let fields = null;
    try {
      if (!this.flags.fields) {
        const ds = await conn.sobject(this.flags.sobject).describe();
        fields = ds.fields;
      }
    } catch (error) {
      this.ux.stopSpinner('error');
      this.ux.logJson(error);
      return;
    }
    const qf = this.flags.fields || fields.map((f) => f.name).join(',');
    const sosl = `FIND {${this.flags.key}} IN ALL FIELDS RETURNING ${this.flags.sobject}(${qf})`;

    if (this.flags.print) {
      this.ux.log(sosl);
      this.ux.stopSpinner('done');
      return;
    }

    conn
      .search(sosl)
      .then((res) => {
        this.ux.stopSpinner(`done, find ${res.searchRecords.length}`);
        this.ux.logJson(res.searchRecords);
      })
      .catch((error) => {
        this.ux.stopSpinner('error');
        this.ux.logJson(error);
      });
  }
}
