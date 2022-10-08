function isType(value: unknown, type: string) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export function isArray(value: unknown): value is [] {
  return isType(value, 'Array');
}

export function isObject(value: unknown): value is Indeable {
  return isType(value, 'Object');
}

export function isString(value: unknown): value is string {
  return isType(value, 'String');
}

export function isFunction(value: unknown): value is Function {
  return isType(value, 'Function');
}

export function isNumber(value: unknown): value is number {
  return isType(value, 'Number');
}

export function isNull(value: unknown): value is null {
  return isType(value, 'Null');
}

export function isUndefined(value: unknown): value is undefined {
  return isType(value, 'Undefined');
}

export function isUseful(value: unknown): value is undefined & null {
  return !isNull(value) && !isUndefined(value);
}
