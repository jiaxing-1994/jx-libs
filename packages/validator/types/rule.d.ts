export interface RuleType {
  [key: string]: any;
  validatorType: string; //
  message?: string; // 错误提示信息
  regexp?: RegExp; // 正则
  required?: boolean; // 是否必填
  min?: number; // 最小值
  max?: number; // 最大值
  validator?: (rule: RuleType, value: any, model?: Record<string, any>) => string | null; // 同步校验器
  asyncValidator?: (
    rule: RuleType,
    value: any,
    callback: (message?: string) => void
  ) => Promise<undefined>; // 异步校验器
}
