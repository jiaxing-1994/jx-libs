import { RuleType, ErrorType } from "../types";

export const compareLen = (len: number, num: number, type = ">") => {
  switch (type) {
    case ">":
      return len > num;
    case ">=":
      return len >= num;
    case "<":
      return len < num;
    case "<=":
      return len <= num;
    default:
      return true;
  }
};
