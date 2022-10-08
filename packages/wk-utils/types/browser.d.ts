type isTrident = () => boolean // IE内核
type isPresto = () => boolean // opera内核
type isWebKit = () => boolean // 苹果、谷歌内核
type isGecko = () => boolean // 火狐内核
type isMobile = () => boolean // 是否为移动终端
type isIos = () => boolean // ios终端
type isAndroid = () => boolean // android终端
type isIPhone = () => boolean // 是否为iPhone或者QQHD浏览器
type isIPad = () => boolean // 是否iPad
type isWebApp = () => boolean // 是否web应该程序，没有头部与底部
type isWeixin = () => boolean // 是否微信(苹果越狱用户可用后面一种方式识别)
type isQQ = () => boolean // 是否QQ
type isMac = () => boolean // 是否mac

export {
	isTrident,
	isPresto,
	isWebKit,
	isGecko,
	isMobile,
	isIos,
	isAndroid,
	isIPhone,
	isIPad,
	isWebApp,
	isWeixin,
	isQQ,
	isMac,
}
