const dateReg = /^(\d{4})[-|\/|\\](\d{1,2})[-|\/|\\](d{1,2})\s(d{2}):(\d{2}):(\d{2})$/; // 时间格式
const colorReg = /^#([0-9a-fA-F]{3})|([0-9a-fA-F]{6})|([0-9a-fA-F]{8})$/; // #fff #ffffff #ffffff7a
const pxReg = /^(\d+.?\d*)px$/; // 12px
const pureStringReg = /^\w+$/; // 纯'有效'字符
const pureNumberReg = /^\d+$/; // 纯数字
const pureDWordReg = /^[^\x00-\xff]+$/; //  纯文字
const telephoneReg = /^(1\d{10})|([0][0-9]{2,3}-[0-9]{5,10})$/;
const idReg = /\d{6}([12]\d{3})([01]\d)([0-3]\d)\d{2}(\d)[\d|X]/;
const passwordReg =
  /((?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[!@#$])|(?=.*[!@#$])(?=.*[0-9]))^[a-zA-Z0-9!@#$]{6,16}$/;
const licensePlateReg =
  /^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][0-9DF][0-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3}[0-9DF][学挂主]?|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5,6}[学挂主]?)$/;

export {
  dateReg,
  colorReg,
  pxReg,
  pureStringReg,
  pureNumberReg,
  pureDWordReg,
  telephoneReg,
  idReg,
  passwordReg,
  licensePlateReg,
};
