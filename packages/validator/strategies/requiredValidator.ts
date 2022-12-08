import { isString, isNumber } from "@wk-libs/utils";
import { ErrorType, RuleType } from "../types";

const requiredValidator = (value: any, rule: RuleType): boolean | ErrorType => {
  if (isString(value)) {
    value = value.trim();
  }
  let compareRes = false; // 默认不通过
  const errorMsg = "不能为空";
  if (value || isNumber(value)) {
    compareRes = true;
  }
  return (
    compareRes || {
      errMsg: rule.message || errorMsg,
      rule,
      value,
    }
  );
};

export default requiredValidator;
