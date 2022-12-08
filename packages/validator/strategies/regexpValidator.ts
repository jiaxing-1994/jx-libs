import { isNumber } from "@wk-libs/utils";
import { ErrorType, RuleType } from "../types";

const regexpValidator = (value: any, rule: RuleType): boolean | ErrorType => {
  let compareRes = true;
  const errorMsg = "值不正确";
  // 不校验空值
  if ((value || isNumber(value)) && rule.regexp && !rule.regexp.test(String(value))) {
    compareRes = false;
  }
  return (
    compareRes || {
      errMsg: rule.message || errorMsg,
      rule,
      value,
    }
  );
};

export default regexpValidator;
