import { isString, isObject } from "@wk-libs/utils";
import requiredValidator from "./strategies/requiredValidator";
import sizeValidator from "./strategies/sizeValidator";
import lengthValidator from "./strategies/lengthValidator";
import regexpValidator from "./strategies/regexpValidator";
import { ErrorType, RuleType } from "./types";

class Validator {
  private validatorStrategy: Record<string, (value: any, rule: RuleType) => boolean | ErrorType>;

  constructor() {
    // 可优化
    this.validatorStrategy = {
      SIZE: sizeValidator,
      LENGTH: lengthValidator,
      REQUIRED: requiredValidator,
      REGEXP: regexpValidator,
    };
  }

  validator(value: any, rule: RuleType[]) {
    const errList: ErrorType[] = [];
    rule.forEach((ruleItem: RuleType) => {
      if (this.validatorStrategy[ruleItem.validatorType]) {
        if (isString(value)) {
          value = value.trim();
        }
        const res = this.validatorStrategy[ruleItem.validatorType](value, ruleItem);
        if (isObject(res)) {
          errList.push(res);
        }
      }
    });
    return errList.length > 0 ? errList : true;
  }

  validatorObj(valueObj: Record<string, any>, rule: Record<string, RuleType[]>) {
    const errObj: Record<string, ErrorType[]> = {};
    for (const key in valueObj) {
      if (rule[key]) {
        const res = this.validator(valueObj[key], rule[key]);
        if (res !== true) {
          errObj[key] = res;
        }
      }
    }
    return Object.keys(errObj).length > 0 ? errObj : true;
  }
}
export default Validator;
