import { isString } from "@wk-libs/utils";
import { ErrorType, RuleType } from "../types";

const requiredValidator = (value: any, rule: RuleType): boolean | ErrorType => {
  if (isString(value)) {
    value = value.trim();
  }
  let compareRes = false;
  const errorMsg = "不能为空";
  if (value || value === 0) {
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
