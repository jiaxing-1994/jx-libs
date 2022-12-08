import Storage from "../storage";

export interface Options {
  strategy: string;
}

declare module "@wk-libs/storage" {
  export type Storage = typeof Storage;
}

export default Storage;
