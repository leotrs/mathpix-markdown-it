import {TTokenTabular} from "./index";
import {getContent} from "./common";

type TSubTabular = {id: string, parsed: Array<TTokenTabular>};
var subTabular: Array<TSubTabular> = [];

export const ClearSubTableLists = (): void => {
  subTabular = [];
};

export const pushSubTabular = (str: string, subRes: Array<TTokenTabular>, posBegin: number=0, posEnd: number, i: number=0): string => {
  const id = `f${(+new Date +  (Math.random()*100000).toFixed()).toString()}`;
  subTabular.push({id: id, parsed: subRes});
  if (posBegin > 0) {
    return str.slice(i, posBegin) + `<<${id}>>` + str.slice(posEnd + '\\end{tabular}'.length, str.length);
  }else {
    return `<<${id}>>` + str.slice(posEnd + '\\end{tabular}'.length, str.length);
  }
};

export const getSubTabular = (sub: string, i: number, isCell: boolean = true): Array<TTokenTabular> | null => {
  let res: Array<TTokenTabular> = [];
  let lastIndex: number = 0;
  sub = sub.trim();
  if (isCell) {sub = getContent(sub, true)}

  const index: number = subTabular.findIndex(item => item.id === sub);
  if (index >= 0) {
    res = res.concat(subTabular[index].parsed);
    return res;
  }

  let cellM =  sub.slice(i).match(/(?:<<([\w]*)>>)/g);
  cellM =  cellM ? cellM : sub.slice(i).match(/(?:<([\w]*)>)/g);
  if (!cellM) {
    return null;
  }

  for (let j=0; j < cellM.length; j++) {
    let t = cellM[j].replace(/</g, '').replace(/>/g, '');
    if (!t) { continue }
    const index = subTabular.findIndex(item => item.id === t);
    if (index >= 0) {
      const iB: number = sub.indexOf(cellM[j]);
      const strB: string = sub.slice(0, iB).trim();
      if (strB && strB.length > 0) {
        res.push({token: 'inline', tag: '', n: 0, content: strB})
      }
      res = res.concat(subTabular[index].parsed);
      lastIndex = iB + cellM[j].length;

      sub = sub.slice(lastIndex)
      if (j === cellM.length - 1) {
        const strE: string = sub;
        if (strE && strE.length > 0) {
          res.push({token: 'inline', tag: '', n: 0, content: strE})
        }
      }
    }
  }
  return res;
};
