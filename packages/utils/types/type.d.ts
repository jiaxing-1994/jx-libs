export const deepCopy: <T>(data: T) => T;
export function mergeObj(o1: object, o2: object): object;
export function parseUrlParams(): Record<string, any>;
export function generateUrlParams(obj: Record<string, any>): string;
export function uuid(namespace: string, type?: string, num?: number): string;

export function getDomByClass(
  container: HTMLElement | Element,
  className: string
): HTMLElement[] | Element[];
export function getStyleByDom(
  dom: HTMLElement | Element,
  attr: string,
  isStyle?: boolean
): string | number | null;
export function setStyleByDom(
  dom: HTMLElement | Element,
  attr: string,
  value: string,
  isStyle?: boolean
): void;
export function createSvg(type: string, attributes: object): SVGElement;

export const dateReg: RegExp;
export const colorReg: RegExp;
export const pxReg: RegExp;
export const pureStringReg: RegExp;
export const pureNumberReg: RegExp;
export const pureDWordReg: RegExp;
export const telephoneReg: RegExp;
export const passwordReg: RegExp;
export const idReg: RegExp;

export function isArray(value: any): value is any[];
export function isObject(value: any): value is Record<string, any>;
export function isString(value: any): value is string;
export function isFunction(value: any): value is typeof Function;
export function isNumber(value: any): value is number;
export function isBoolean(value: any): value is boolean;

export function isNull(value: any): value is null;
export function isUndefined(value: any): value is undefined;
export function isUseful(value: any): value is any[] | object | string | typeof Function | number;

export const isMobile: boolean; // IE内核
export const isIos: boolean; // opera内核
export const isAndroid: boolean; // 苹果、谷歌内核
export const isIPhone: boolean; // 火狐内核
export const isIPad: boolean; // 是否为移动终端
export const isWeixin: boolean; // ios终端
export const isQQ: boolean; // android终端
export const isMac: boolean; // 是否为iPhone或者QQHD浏览器
