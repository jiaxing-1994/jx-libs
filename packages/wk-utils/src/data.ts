import { isArray, isObject, isUseful } from './type';

// 深拷贝
export function deepCopy(data: unknown):unknown|null {
  if (isArray(data)) {
    const newData: any[] = [];
    for (let i in data) {
      if (isArray(data[i]) || isObject(data[i])) {
        newData.push(deepCopy(data[i]));
      } else {
        newData.push(data[i]);
      }
    }
    return newData;
  }
  if (isObject(data)) {
    const newData: Indeable = {};
    for (let i in data) {
      if (isArray(data[i]) || isObject(data[i])) {
        newData[i] = deepCopy(data[i]);
      } else {
        newData[i] = data[i];
      }
    }
    return newData;
  }
  return data;
}

// 唯一值
let uuidMap = new Map();
export function uuid(namespace:string = 'global', type = 'mix', num = 3) {
  if (!uuidMap.get(namespace)) {
    uuidMap.set(namespace, new Set());
  }
  const number = '1234567890';
  const string = 'abcdefghijklmnopqrstuvwxyz';
  let source = '';
  switch (type) {
    case 'mix': source = number + string; break;
    case 'number': source = number; break;
    case 'string': source = string; break;
    default: source = number + string; break;
  }
  function getUuid(c = source[parseInt(`${Math.random() * (source.length - 1)}`)]): string {
    return c.length < num ? getUuid(c += source[parseInt(`${Math.random() * (source.length - 1)}`)])
      : c;
  }
  let uuid = getUuid();
  while (uuidMap.get(namespace).has(uuid)) {
    uuid = getUuid();
  }
  uuidMap.get(namespace).add(uuid);
  return uuid;
}

// 合并对象
export function mergeObj(o1: unknown, o2: unknown) {
  const obj: Indeable = {};
  if (isObject(o1) && isObject(o2)) {
    for (const key in o1) {
      obj[key] = o1[key];
      if (isUseful(o2[key])) {
        // 说明目标对象存在当前键
        if (isObject(o1[key]) && isObject(o2[key])) {
          obj[key] = mergeObj(o1[key], o2[key]);
        } else {
          obj[key] = o2[key];
        }
      }
    }
  } else {
    throw new Error('参数不是对象');
  }
  return obj;
}

// 解析url参数
export function parseUrlParams() {
  const { href } = window.location;
  if (href.indexOf('?') > -1) {
    const paramsArr = decodeURIComponent(href).split('?')[1].split('&');
    const params: Indeable = {};
    paramsArr.forEach((param) => {
      if (param.indexOf('=') > -1) {
        const paramArr = param.split('=');
        const key = paramArr[0];
        const value = paramArr[1] || '';
        params[key] = value;
      }
    });
    return params;
  }
  return {};
}

// 生成url参数
export function generateUrlParams(obj: unknown) {
  let urlParamsArr = [];
  if (isObject(obj)) {
    for (const key in obj) {
      if (obj[key]) {
        urlParamsArr.push(`${key}=${obj[key]}`);
      }
    }
  }
  return urlParamsArr.join('&');
}
