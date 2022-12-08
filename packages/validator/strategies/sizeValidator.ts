import { ErrorType, RuleType } from "../types";
import { isNumber } from "@wk-libs/utils";
import { compareLen } from "./common";

const sizeValidator = (value: any, rule: RuleType): boolean | ErrorType => {
  let compareRes = true; // 默认通过
  let errorMsg = "非数字";
  // 不校验空值
  if (value) {
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
