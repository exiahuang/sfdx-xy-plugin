const isDirMeta = (file: string) : boolean => !!['lwc', 'aura'].find(metaDir => file.includes(`/${metaDir}/`));

const findMetas = (files: string[]) : string[] => {
    return files.reduce((metas: string[], cur: string)=>{
        return cur.endsWith('-meta.xml') ? [
            ...metas,
            cur
        ] : metas;
    }, []);
}

export {
    isDirMeta,
    findMetas,
}