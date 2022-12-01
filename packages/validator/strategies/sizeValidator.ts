import { ErrorType, RuleType } from "../types";
import { isNumber, isUseful } from "@wk-libs/utils";
import { compareLen } from "./common";

const sizeValidator = (value: any, rule: RuleType): boolean | ErrorType => {
  let compareRes = false; // 默认不通过
  let errorMsg = "非数字";
  if (isUseful(value)) {
    value = Number(value);
    if (isNumber(value)) {
      errorMsg = "校验不通过";
      rule.min && (compareRes = compareLen(value, rule.min, ">="));
      compareRes && rule.max && (compareRes = compareLen(value, rule.max, "<="));
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
