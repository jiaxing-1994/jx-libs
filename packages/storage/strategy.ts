class StorageStrategy {
  private strategy: string;
  private strategyMap: {
    [key: string]: any;
  };
  constructor(strategy: string) {
    this.strategyMap = {
      h5: {
        local: localStorage,
        session: sessionStorage,
      },
    };
    this.strategy = strategy;
  }

  setLocalItem(key: string, value: any) {
    return this.strategyMap[this.strategy].local.setItem(key, JSON.stringify(value));
  }

  setSessionItem(key: string, value: any) {
    return this.strategyMap[this.strategy].session.setItem(key, JSON.stringify(value));
  }

  getLocalItem(key: string) {
    return JSON.parse(this.strategyMap[this.strategy].local.getItem(key));
  }

  getSessionItem(key: string) {
    return JSON.parse(this.strategyMap[this.strategy].session.getItem(key));
  }
}

export default StorageStrategy;
