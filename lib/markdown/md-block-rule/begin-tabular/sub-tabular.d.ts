import { TTokenTabular } from "./index";
export declare const ClearSubTableLists: () => void;
export declare const pushSubTabular: (str: string, subRes: string | TTokenTabular[], posBegin: number, posEnd: number, i?: number) => string;
export declare const getSubTabular: (sub: string, i: number, isCell?: boolean) => TTokenTabular[];
