import { flags, SfdxCommand } from '@salesforce/command';

export default class SfdxOpen extends SfdxCommand {
  public static description = 'open sf';

  public static examples = ['sf xy open -f Test.page'];

  protected static flagsConfig = {
    file: flags.string({ char: 'f', required: true, description: 'file name/file path' }),
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    const conn = await this.org.getConnection();
    const splitCode = this.flags.file.includes('\\') ? '\\' : '/';
    const files = this.flags.file
      .split(splitCode)
      .reverse()
      .find((x) => !!x)
      .split('.');
    const name = files.find((x) => !!x);
    const ext = files.reverse().find((x) => !!x);
    const urls = [conn.instanceUrl];
    switch (ext) {
      case 'page':
        urls.push(`apex/${name}`);
        break;
      default:
        break;
    }
    this.ux.log(urls.join('/'));
  }
}
