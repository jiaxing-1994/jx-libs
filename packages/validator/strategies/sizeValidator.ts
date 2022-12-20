import { ErrorType, RuleType } from "../types";
import { isNumber } from "@wk-libs/utils";
import { compareLen } from "./common";

const sizeValidator = (
  value: any,
  rule: RuleType,
  model: Record<string, any> = {}
): boolean | ErrorType => {
  let compareRes = true; // 默认通过
  let errorMsg = "非数字";
  if (rule.validator instanceof Function) {
    const res = rule.validator(rule, value, model);
    if (res) {
      errorMsg = res;
    }
    compareRes = !res;
  } else if (value) {
    // 不校验空值
    value = Number(value);
    if (isNumber(value)) {
      errorMsg = "校验不通过";
      rule.min && (compareRes = compareLen(value, rule.min, ">="));
      compareRes && rule.max && (compareRes = compareLen(value, rule.max, "<="));
    } else {
      compareRes = false;
    }
  }
  return (
    compareRes || {
      errMsg: rule.message || errorMsg,
      rule,
      value,
    }
  );
};

export default sizeValidator;
