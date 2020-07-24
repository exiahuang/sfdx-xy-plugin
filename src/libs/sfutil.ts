import * as fs from 'fs';
import * as path from 'path';
import { METADATA_TYPES } from './const';

const isIncludeType = (types: string[]) => (file: string) : boolean => !!(types.find(type => file.includes(`/${type}/`)));
const isLwcTest = (file: string) : boolean => file.includes('__test__') || file.includes('__tests__');
const isMetaData = isIncludeType(METADATA_TYPES);
const isLightingMeta = isIncludeType(['lwc', 'aura']);

const findMetas = (files: string[]) : string[] => {
    return files.reduce((metas: string[], file: string)=>{
        return file.endsWith('-meta.xml') ? [
            ...metas,
            file
        ] : metas;
    }, []);
}

const findMetasByfilename = (files: string[]) : string[] => {
    return files.reduce((metas: string[], file: string)=>{
        if(!isMetaData(file) || isLwcTest(file)) return metas;
        const fsStat = fs.statSync(file);
        if(isLightingMeta(file)){
            let f = fsStat.isDirectory() ? file : fsStat.isFile() ? path.dirname(file) : '';
            if(!metas.includes(f)){
                return [
                    ...metas,
                    f
                ];
            }
        } else {
            return [
                ...metas,
                file
            ];
        }
        return metas;
    }, []);
}

export {
    isMetaData,
    isLightingMeta,
    findMetas,
    findMetasByfilename,
}