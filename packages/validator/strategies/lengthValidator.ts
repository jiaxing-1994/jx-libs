import { isString, isNumber } from "@wk-libs/utils";
import { compareLen } from "./common";
import { RuleType } from "../types";

const lengthValidator = (value: any, rule: RuleType) => {
  let compareRes = true; // 默认通过
  let errorMsg = "非字符";
  // 不校验空值
  if (value || isNumber(value)) {
    value = String(value);
    if (isString(value)) {
      errorMsg = "校验不通过";
      rule.min && (compareRes = compareLen(value.length, rule.min, ">="));
      compareRes && rule.max && (compareRes = compareLen(value.length, rule.max, "<="));
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

export default lengthValidator;
