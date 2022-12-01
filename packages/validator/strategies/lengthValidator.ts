import { isString, isUseful } from "@wk-libs/utils";
import { compareLen } from "./common";
import { RuleType } from "../types";

const lengthValidator = (value: any, rule: RuleType) => {
  let compareRes = false; // 默认不通过
  let errorMsg = "非字符";
  if (isUseful(value)) {
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
