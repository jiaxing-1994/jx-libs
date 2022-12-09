import WkHttp from "../WkHttp";
export * from "axios";

export default WkHttp;

declare module "@wk-libs/http" {
  export default WkHttp;
}
