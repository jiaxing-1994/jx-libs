export interface ErrorType {
	errMsg: string,
	rule?: RuleType,
	value?: any,
}
export interface RuleType {
	[key: string]: any,
	validatorType: string,
	message?: string,
	regx?: RegExp,
	trigger?: string[],
	required?: boolean,
	min?: number,
	max?: number,
	validator?: (rule: RuleType, value: any, callback: (message?: string) => void) => void,
	asyncValidator?: (rule: RuleType, value: any, callback: (message?: string) => void) => Promise<undefined>,
}
export default class FormValidator {
	constructor() {
	}

	async validator(value: any, rule: RuleType[]): Promise<ErrorType[]> => {
		const promises: Promise<any>[] = [];
		rule.forEach((ruleItem: RuleType) => {
			if (validatorStrategy[ruleItem.validatorType]) {
				if (wkUtils.isString(value)) {
					value = value.trim();
				}
				promises.push(validatorStrategy[ruleItem.validatorType](value, ruleItem));
			}
		});
		const errList = await Promise.all(promises);
		return errList.filter((err) => err);
	};
}
