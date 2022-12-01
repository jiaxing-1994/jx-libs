import { RuleType } from "./rule";

export interface ErrorType {
  errMsg: string;
  rule?: RuleType;
  value?: any;
}
