declare type Indeable = {
	[key: string]: any,
}
declare module '@wk-libs/utils' {
	const deepCopy: <T>(data: T) => T;
	const mergeObj: (o1:object, o2:object) => object;
	const parseUrlParams: () => object;
	const generateUrlParams: (obj: object) => string;
	const uuid: (value?: string, type?: string, num?: number) => string;
	interface Data {
		[key: string]: any,
		deepCopy: typeof deepCopy,
		mergeObj: typeof mergeObj,
		parseUrlParams: typeof parseUrlParams,
		generateUrlParams: typeof generateUrlParams,
		uuid: typeof uuid,
	}
	const getDomByClass: (container: HTMLElement|Element, className: string) => HTMLElement[]|Element[];
	const getStyleByDom: (dom: HTMLElement|Element, attr: string, isStyle?: boolean) => string|number|null;
	const setStyleByDom: (dom: HTMLElement|Element, attr: string, value: string, isStyle ?: boolean) => void;
	const createSvg: (type: string, attributes: object) => SVGElement;
	interface Dom {
		[key: string]: any,
		getDomByClass: typeof getDomByClass,
		getStyleByDom: typeof getStyleByDom,
		setStyleByDom: typeof setStyleByDom,
		createSvg: typeof createSvg,
	}
	const dateReg: RegExp;
	const colorReg: RegExp;
	const pxReg: RegExp;
	const pureStringReg: RegExp;
	const pureNumberReg: RegExp;
	const pureDWordReg: RegExp;
	interface Reg {
		[key: string]: RegExp,
		dateReg: typeof dateReg,
		colorReg: typeof colorReg,
		pxReg: typeof pxReg,
		pureStringReg: typeof pureStringReg,
		pureNumberReg: typeof pureNumberReg,
		pureDWordReg: typeof pureDWordReg,
	}
	const isArray: (value: any) => value is any[];
	const isObject: (value: any) => value is Indeable;
	const isString: (value: any) => value is string;
	const isFunction: (value: any) => value is Function;
	const isNumber: (value: any) => value is number;
	const isNull: (value: any) => value is null;
	const isUndefined: (value: any) => value is undefined;
	const isUseful: (value: any) => value is any[]|object|string|Function|number;
	interface Type {
		[key: string]: (value: any) => boolean,
		isArray: typeof isArray,
		isObject: typeof isObject,
		isString: typeof isString,
		isFunction: typeof isFunction,
		isNumber: typeof isNumber,
		isNull: typeof isNull,
		isUndefined: typeof isUndefined,
		isUseful: typeof isUseful,
	}
	type isTrident = () => boolean // IE内核
	type isPresto = () => boolean // opera内核
	type isWebKit = () => boolean // 苹果、谷歌内核
	type isGecko = () => boolean // 火狐内核
	type isMobile = () => boolean // 是否为移动终端
	type isIos = () => boolean // ios终端
	type isAndroid = () => boolean // android终端
	type isIPhone = () => boolean // 是否为iPhone或者QQHD浏览器
	type isIPad = () => boolean // 是否iPad
	type isWebApp = () => boolean // 是否web应该程序，没有头部与底部
	type isWeixin = () => boolean // 是否微信(苹果越狱用户可用后面一种方式识别)
	type isQQ = () => boolean // 是否QQ
	type isMac = () => boolean // 是否mac
	export {
		isTrident,
		isPresto,
		isWebKit,
		isGecko,
		isMobile,
		isIos,
		isAndroid,
		isIPhone,
		isIPad,
		isWebApp,
		isWeixin,
		isQQ,
		isMac,
		Data,
		Dom,
		Reg,
		Type,
		deepCopy,
		mergeObj,
		uuid,
		parseUrlParams,
		generateUrlParams,
		getDomByClass,
		getStyleByDom,
		setStyleByDom,
		createSvg,
		dateReg,
		colorReg,
		pxReg,
		pureStringReg,
		pureNumberReg,
		pureDWordReg,
		isArray,
		isObject,
		isString,
		isFunction,
		isNumber,
		isNull,
		isUndefined,
		isUseful,
	}
}



