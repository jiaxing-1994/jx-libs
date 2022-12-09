import { isObject } from "@wk-libs/utils";
import StorageStrategy from "./strategy";
import { Options } from "./types";

class Storage {
  private namespace: string;
  private options: Partial<Options>;
  private localStorageObj: Record<string, any>;
  private sessionStorageObj: Record<string, any>;
  private storageInstance: StorageStrategy;
  constructor(namespace: string, options: Partial<Options>) {
    this.options = {
      strategy: "h5",
    };
    Object.assign(this.options, options);
    const { strategy } = options;
    this.namespace = namespace;
    this.localStorageObj = {};
    this.sessionStorageObj = {};
    this.storageInstance = new StorageStrategy(strategy || "h5");
    this.init();
  }

  init() {
    if (this.storageInstance.getLocalItem(this.namespace)) {
      this.localStorageObj = this.storageInstance.getLocalItem(this.namespace);
    } else {
      this.storageInstance.setLocalItem(this.namespace, {});
    }
    if (this.storageInstance.getSessionItem(this.namespace)) {
      this.sessionStorageObj = this.storageInstance.getSessionItem(this.namespace);
    } else {
      this.storageInstance.setSessionItem(this.namespace, {});
    }
  }

  setLocal(keyStr: string, value: any) {
    if (!this.storageInstance) {
      throw new Error("储存器未实例化");
    }
    const keyArr = keyStr.split(".");
    let result: Record<string, any> = this.localStorageObj;
    while (keyArr.length) {
      const key = keyArr.shift();
      if (key) {
        if (keyArr.length === 0) {
          result[key] = value;
        } else if (!result[key]) {
          result[key] = {};
          result = result[key];
        }
      }
    }
    this.storageInstance.setLocalItem(this.namespace, this.localStorageObj);
  }

  getLocal(keyStr: string) {
    const keyArr = keyStr.split(".");
    let result: Record<string, any> | null = this.localStorageObj;
    while (keyArr.length) {
      const key = keyArr.shift();
      if (key && isObject(result) && result[key]) {
        result = result[key];
      } else {
        result = null;
      }
    }
    if (result) {
      return result;
    }
    return null;
  }

  removeLocal(key: string) {
    if (!this.storageInstance) {
      throw new Error("储存器未实例化");
    }
    if (key in this.localStorageObj) {
      delete this.localStorageObj[key];
    }
    this.storageInstance.setLocalItem(this.namespace, this.localStorageObj);
  }

  setSession(key: string, value: any) {
    if (!this.storageInstance) {
      throw new Error("储存器未实例化");
    }
    this.sessionStorageObj[key] = value;
    this.storageInstance.setSessionItem(this.namespace, this.sessionStorageObj);
  }

  getSession(key: string) {
    if (this.sessionStorageObj[key]) {
      return this.sessionStorageObj[key];
    }
    return null;
  }

  removeSession(key: string) {
    if (!this.storageInstance) {
      throw new Error("储存器未实例化");
    }
    if (key in this.sessionStorageObj) {
      delete this.sessionStorageObj[key];
    }
    this.storageInstance.setSessionItem(this.namespace, this.sessionStorageObj);
  }
}

export default Storage;
