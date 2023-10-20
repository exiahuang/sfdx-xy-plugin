import { flags, SfdxCommand } from '@salesforce/command';

export default class XyDataQueryOne extends SfdxCommand {
  public static description = 'query one sobject';

  public static examples = ['sf xy data q --sobject Account --where "Id=\'001xxx\'" --all'];

  protected static flagsConfig = {
    sobject: flags.string({ char: 's', required: true, description: 'sobject api name.' }),
    fields: flags.string({ required: false, description: 'fields.' }),
    where: flags.string({ required: false, description: 'where clause.' }),
    all: flags.boolean({ required: false, description: 'Include deleted records.' }),
    json: flags.boolean({ required: false, description: 'print json.' }),
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    const conn = await this.org.getConnection();
    this.ux.startSpinner(`start to query`);
    this.ux.setSpinnerStatus(`running`);
    let fields = null;
    try {
      const ds = await conn.sobject(this.flags.sobject).describe();
      fields = ds.fields;
    } catch (error) {
      this.ux.stopSpinner('error');
      this.ux.logJson(error);
      return;
    }

    const qf = this.flags.fields || fields.map((f) => f.name).join(',');
    const where = this.flags.where ? `WHERE ${this.flags.where}` : '';
    const soql = `SELECT ${qf} FROM ${this.flags.sobject} ${where} LIMIT 1`;

    this.ux.log(soql);
    (this.flags.all ? conn.queryAll(soql) : conn.query(soql))
      .then((res) => {
        const record = res.records[0];
        const tableData = Object.keys(record).map((name) => {
          const { label, type, updateable, referenceTo, calculatedFormula } =
            fields?.find((f) => f.name === name) || {};
          return {
            name,
            label,
            value: record[name],
            type,
            updateable,
            referenceTo,
            calculatedFormula,
          };
        });
        this.ux.stopSpinner(`done`);
        if (this.flags.json) {
          this.ux.logJson(tableData);
        } else {
          console.table(tableData);
        }
      })
      .catch((error) => {
        this.ux.stopSpinner('error');
        this.ux.logJson(error);
      });
  }
}
