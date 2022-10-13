import Emit, { FnType } from './emit.js';

type CreateEmitsType = {
  on: (fn: FnType) => void,
  emit: (params: any) => void,
  once: (fn: FnType) => void,
}

const Emits = new Emit();
const createEmits = (action: string): CreateEmitsType => {
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
export const Hooks:HooksType = {
  beforeMove: createEmits.call(Emits, 'beforeMove'),
  move: createEmits.call(Emits, 'move'),
  afterMove: createEmits.call(Emits, 'afterMove'),
  createEmit: (type: string) => {
    Hooks[type] = createEmits.call(Emits, type);
  }
}

export type HooksType = {
  [key: string]: any,
  beforeMove: CreateEmitsType,
  move: CreateEmitsType,
  afterMove: CreateEmitsType,
  createEmit: (type: string) => void,
}

export default Hooks;
