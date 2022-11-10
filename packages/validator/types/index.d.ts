export interface RuleType {
	[key: string]: any,
	validatorType: string, // 较硬气
	message?: string, // 错误提示信息
	regx?: RegExp,
	trigger?: string[],
	required?: boolean, // 是否必填
	min?: number, // 最小值
	max?: number, // 最大值
	validator?: (rule: RuleType, value: any, callback: (message?: string) => void) => void, // 同步校验器
	asyncValidator?: (rule: RuleType, value: any, callback: (message?: string) => void) => Promise<undefined>, // 异步校验器
}
