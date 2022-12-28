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
  let validatorMsg: string | null = "";
  if (rule.validator instanceof Function) {
    validatorMsg = rule.validator(rule, value, model);
    compareRes = !validatorMsg;
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
      errMsg: validatorMsg || rule.message || errorMsg,
      rule,
      value,
    }
  );
};

export default sizeValidator;
