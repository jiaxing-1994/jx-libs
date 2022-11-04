const { userAgent } = navigator;

// const isMobile = (): boolean => !!userAgent.match(/AppleWebKit.*Mobile.*/); // 是否为移动终端
// const isIos = (): boolean => !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
// const isAndroid = (): boolean => userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1; // android终端
// const isIPhone = (): boolean => userAgent.indexOf('iPhone') > -1; // 是否为iPhone或者QQHD浏览器
// const isIPad = (): boolean => userAgent.indexOf('iPad') > -1; // 是否iPad
// const isWeixin = (): boolean => userAgent.indexOf('MicroMessenger') > -1 || userAgent.indexOf('open_news') > -1; // 是否微信(苹果越狱用户可用后面一种方式识别)
// const isQQ = (): boolean => !!userAgent.match(/\sQQ/i); // 是否QQ
// const isMac = (): boolean => /Macintosh; Intel Mac OS X/.test(userAgent); // 是否mac

const isMobile = !!userAgent.match(/AppleWebKit.*Mobile.*/); // 是否为移动终端
const isIos = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1; // android终端
const isIPhone = userAgent.indexOf('iPhone') > -1; // 是否为iPhone或者QQHD浏览器
const isIPad = userAgent.indexOf('iPad') > -1; // 是否iPad
const isWeixin = userAgent.indexOf('MicroMessenger') > -1 || userAgent.indexOf('open_news') > -1; // 是否微信(苹果越狱用户可用后面一种方式识别)
const isQQ = !!userAgent.match(/\sQQ/i); // 是否QQ
const isMac = /Macintosh; Intel Mac OS X/.test(userAgent); // 是否mac

export {
  isMobile,
  isIos,
  isAndroid,
  isIPhone,
  isIPad,
  isWeixin,
  isQQ,
  isMac,
}
