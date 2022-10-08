export type FnType = (params?: any) => void;
export type ActionType = {
  type: string,
  fn: FnType,
  context?: object
}
export type EmitFn = (action: string, fn: FnType, context?: object) => void;

export default class Emit {
  private actions: Map<string, ActionType[]>
  constructor() {
    this.actions = new Map();
  }

  emit(action: string, params?: any) {
    if (!this.actions.get(action)) {
      return;
    }
    const actions = this.actions.get(action);
    actions?.forEach(({ type, fn, context }, index) => {
      fn.call(context, params);
      switch (type) {
        case 'once': actions.splice(index, 1); break;
        default: break;
      }
    });
  }

  on(action: string, fn: FnType, context: object = this) {
    if (!this.actions.get(action)) {
      this.actions.set(action, []);
    }
    this.actions.get(action)?.push({
      type: 'on',
      fn,
      context,
    });
  }

  once(action: string, fn: FnType, context: object = this) {
    if (!this.actions.get(action)) {
      this.actions.set(action, []);
    }
    const onceFn = (...args: any[]) => {
      this.off(action, fn);
      const res = fn.apply<any, any[], any>(context, args);
      if (res) {
        return res;
      }
    }
    this.actions.get(action)?.push({
      type: 'once',
      fn: onceFn,
      context,
    });
  }

  off(action?: string, fn?: FnType) {
    if (!action && !fn) {
      this.actions.clear();
      return this;
    }
    if (action && this.actions.get(action)) {
      if (!fn) {
        this.actions.set(action, []);
        return this;
      }
      const actions = this.actions.get(action);
      if (!actions || actions.length === 0) {
        return this;
      }
      let count = actions.length;
      while (count--) {
        if (actions[count].fn === fn) {
          actions.splice(count, 1);
        }
      }
    }
    return this;
  }
}
