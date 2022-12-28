import { isString, isNumber, isArray, isBoolean } from "@wk-libs/utils";
import { ErrorType, RuleType } from "../types";

const requiredValidator = (
  value: any,
  rule: RuleType,
  model: Record<string, any> = {}
): boolean | ErrorType => {
  if (isString(value)) {
    value = value.trim();
  }
  let compareRes = false; // 默认不通过
  const errorMsg = "不能为空";
  let validatorMsg: string | null = "";
  if (rule.validator instanceof Function) {
    validatorMsg = rule.validator(rule, value, model);
    compareRes = !validatorMsg;
  } else if (isArray(value)) {
    compareRes = value.length > 0;
  } else if (value || isNumber(value) || isBoolean(value)) {
    compareRes = true;
  }
  return (
    compareRes || {
      errMsg: validatorMsg || rule.message || errorMsg,
      rule,
      value,
    }
  );
};

export default requiredValidator;
