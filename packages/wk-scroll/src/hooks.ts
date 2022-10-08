import Emit, { FnType } from './emit.js';

const Emits = new Emit();
const createEmits = (action: string) => {
  return {
    on: (fn: FnType) => {
      Emits.on.call(Emits, action, fn);
    },
    emit: (params: any = {}) => {
      Emits.emit.call(Emits, action, params);
    },
    once: (fn: FnType) => {
      Emits.once.call(Emits, action, fn);
    },
  }
}
export const Hooks = {
  beforeMove: createEmits.call(Emits, 'beforeMove'),
  move: createEmits.call(Emits, 'move'),
  afterMove: createEmits.call(Emits, 'afterMove'),
}

export default Hooks;
