import { flags, SfdxCommand } from '@salesforce/command';

export default class XyDataQuery extends SfdxCommand {
  public static description = 'query sobject';

  public static examples = [
    'sf xy data query --sobject Account --where "CreatedDate = TODAY" --order "CreatedDate DESC" --limit 10000 --offset 0 --all',
    'sf xy data query -s Account --where "CreatedDate = TODAY" --order "CreatedDate DESC',
  ];

  protected static flagsConfig = {
    sobject: flags.string({ char: 's', required: true, description: 'sobject api name.' }),
    fields: flags.string({ required: false, description: 'fields.' }),
    where: flags.string({ required: false, description: 'where clause.' }),
    order: flags.string({ required: false, default: 'CreatedDate DESC', description: 'order by.' }),
    limit: flags.string({ required: false, default: '20000', description: 'limit.' }),
    offset: flags.string({ required: false, description: 'offset.' }),
    all: flags.boolean({ required: false, description: 'Include deleted records.' }),
    print: flags.boolean({ required: false, description: 'print soql.' }),
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
    const where = this.flags.where ? `WHERE ${this.flags.where}` : '';
    const order = this.flags.order ? `ORDER BY ${this.flags.order}` : '';
    const limit = this.flags.limit ? `LIMIT ${this.flags.limit}` : '';
    const offset = this.flags.offset ? `OFFSET ${this.flags.offset}` : '';
    const soql = `SELECT ${qf} FROM ${this.flags.sobject} ${where} ${order} ${limit} ${offset}`;

    // console.log(this.flags)
    if (this.flags.print) {
      this.ux.log(soql);
      this.ux.stopSpinner('done');
      return;
    }

    (this.flags.all ? conn.queryAll(soql) : conn.query(soql))
      .then((res) => {
        this.ux.stopSpinner(`done, find ${res.totalSize}`);
        this.ux.logJson(res.records);
      })
      .catch((error) => {
        this.ux.stopSpinner('error');
        this.ux.logJson(error);
      });
  }
}
