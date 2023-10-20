import * as fs from 'fs';
import * as path from 'path';
import { METADATA_TYPES } from './const';

const isIncludeType =
  (types: string[]) =>
  (file: string): boolean =>
    !!types.find((type) => file.includes(`/${type}/`));
const isLwcTest = (file: string): boolean => file.includes('__test__') || file.includes('__tests__');
const isApexClass = (file: string): boolean => file.endsWith('.cls');
const isMetaData = isIncludeType(METADATA_TYPES);
const isLightingMeta = isIncludeType(['lwc', 'aura']);
const isTestClass = (file: string): boolean => {
  const content = fs.readFileSync(file, { encoding: 'utf-8' });
  return content.includes('@isTest');
};

const findMetas = (files: string[]): string[] => {
  return files.reduce((metas: string[], file: string) => {
    return file.endsWith('-meta.xml') ? [...metas, file] : metas;
  }, []);
};

const findMetasByfilename = (files: string[]): string[] => {
  return files.reduce((metas: string[], file: string) => {
    if (!isMetaData(file) || isLwcTest(file)) return metas;
    const fsStat = fs.statSync(file);
    if (isLightingMeta(file)) {
      let f = fsStat.isDirectory() ? file : fsStat.isFile() ? path.dirname(file) : '';
      if (!metas.includes(f)) {
        return [...metas, f];
      }
    } else {
      return [...metas, file];
    }
    return metas;
  }, []);
};

const findApexClass = (files: string[]): string[] => {
  return files.filter(isApexClass);
};

const findTestClass = (files: string[]): string[] => {
  return files.filter(isApexClass).filter(isTestClass);
};

export {
  isIncludeType,
  isLwcTest,
  isApexClass,
  isMetaData,
  isLightingMeta,
  isTestClass,
  findApexClass,
  findTestClass,
  findMetas,
  findMetasByfilename,
};
