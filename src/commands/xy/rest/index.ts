import { flags, SfdxCommand } from '@salesforce/command';
import { getStdin } from 'ts-stdin';
import { readFile } from '../../../libs/file';

export default class SfRestApi extends SfdxCommand {
  public static description = 'rest post';

  public static examples = [
    'sf xy rest -x post --url /services/apexrest/api/xxx --file data.json',
    'sf xy rest -x post -u /services/apexrest/api/xxx -f data.json',
    'echo data.json | sf xy rest post -u /services/apexrest/api/xxx',
  ];

  protected static flagsConfig = {
    x: flags.string({ char: 'x', default: 'post', required: false, description: 'type: get, post, fetch, delete.' }),
    url: flags.string({ char: 'i', required: true, description: 'url.' }),
    file: flags.string({ char: 'f', required: false, description: 'data' }),
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    const body = this.flags.file
      ? readFile(this.flags.file)
      : (async () => {
          const input = await getStdin();
          return !!input ? JSON.parse(input) : null;
        })();
    const noNeedBody = ['get', 'delete'].find((x) => x !== this.flags.x.toLowerCase());
    if (!body && !noNeedBody) {
      this.ux.error('No data');
      return;
    }
    this.ux.startSpinner(`start to ${this.flags.x} ${this.flags.url}`);
    this.ux.setSpinnerStatus(`running`);

    const conn = await this.org.getConnection();
    let req = null;
    switch (this.flags.x.toUpperCase()) {
      case 'POST':
      case 'PUT':
      case 'PATCH':
        req = {
          method: this.flags.x.toUpperCase(),
          url: this.flags.url,
          body: JSON.stringify(body),
          headers: { 'content-type': 'application/json' },
        };
        break;
      case 'GET':
      case 'DELETE':
        req = {
          method: this.flags.x.toUpperCase(),
          url: this.flags.url,
        };
        break;
      default:
        this.ux.stopSpinner('error, not support type');
        return;
    }

    conn
      .request(req)
      .then((res) => {
        this.ux.stopSpinner('done');
        this.ux.logJson(res);
      })
      .catch((error) => {
        this.ux.stopSpinner('error');
        this.ux.errorJson(error);
      });
  }
}
