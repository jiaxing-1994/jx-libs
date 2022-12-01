import Validator from "../index";
export * from "./rule.d";
export * from "./error.d";

declare module "@wk-libs/validator" {
  export type ValidatorType = typeof Validator;
}
export default Validator;
