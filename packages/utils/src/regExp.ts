const dateReg = /^([0-9]{4})[-|\/|\\]([0-9]{1,2})[-|\/|\\]([0-9]{1,2})\s([0-9]{2}):([0-9]{2}):([0-9]{2})$/; // 时间格式
const colorReg = /^#([0-9a-fA-F]{3})|([0-9a-fA-F]{6})|([0-9a-fA-F]{8})$/; // #fff #ffffff #ffffff7a
const pxReg = /^(\d+.?\d*)px$/; // 12px
const pureStringReg = /^\w+$/; // 纯'有效'字符
const pureNumberReg = /^\d+$/; // 纯数字
const pureDWordReg = /^[^\x00-\xff]+$/; //  纯文字

export {
  dateReg,
  colorReg,
  pxReg,
  pureStringReg,
  pureNumberReg,
  pureDWordReg,
}
