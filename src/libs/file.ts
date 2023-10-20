import * as fs from 'fs';

export const readFile = (file: string) => {
  if (file.endsWith('.json')) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return null;
};
