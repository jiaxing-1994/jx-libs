import { isUseful } from "@wk-libs/utils";
import { ErrorType, RuleType } from "../types";

const regexpValidator = (value: any, rule: RuleType): boolean | ErrorType => {
  let compareRes = true;
  const errorMsg = "值不正确";
  if (!isUseful(value) || (rule.regexp && !rule.regexp.test(String(value)))) {
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
