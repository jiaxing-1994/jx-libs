import { WScroll, HooksType } from '../../types';
// @ts-ignore
import refreshSvg from './loading.svg';

interface OptionsType {
	pullDownMaxHeight: number,
	pullUpMaxHeight: number,
	iconWidth: number,
	pullingText: string,
	loadingText: string,
	loadedText: string,
	noDataText: string,
	finishText: string,
	canLoadText: string,
	onPullDown?: Function,
	onPullUp?: Function,
}

const defaultOptions: OptionsType = {
	pullDownMaxHeight: 80, // 触发下拉刷新的距离
	pullUpMaxHeight: 0, // 触发上拉刷新离底部的距离
	iconWidth: 30,
	pullingText: '下拉刷新',
	loadingText: '加载中',
	loadedText: '加载完成',
	finishText: '暂无更多数据',
	canLoadText: '释放以刷新',
	noDataText: '暂无更多数据',
};

const createTextDom = (): HTMLElement => {
	const textDom = document.createElement('span');
	return textDom;
}
const createSvgDom = (options: OptionsType) => {
	refreshSvg.style.width = `${options.iconWidth}px`;
	refreshSvg.style.height = `${options.iconWidth}px`;
	return refreshSvg.cloneNode(true);
}
const setStyle = (refreshStyle: CSSStyleDeclaration) => {
	refreshStyle.display = 'flex';
	refreshStyle.justifyContent = 'center';
	refreshStyle.alignItems = 'center';
	refreshStyle.position = 'absolute';
	refreshStyle.left = '0px';
	refreshStyle.right = '0px';
	refreshStyle.zIndex = '1';
}
const createPullDownRefreshDom = (instance: WScroll, options: OptionsType) => {
	if (instance.scrollParentWrap && instance.scrollWrap) {
		const refreshDom = document.createElement('div');
		const refreshStyle = refreshDom.style;
		setStyle(refreshStyle);
		refreshStyle.height = `${options.iconWidth}px`;
		refreshStyle.top = `${-options.iconWidth}px`;
		instance.parentStyle && (instance.parentStyle.position = 'relative');
		const textDom = createTextDom();
		const svgDom = createSvgDom(options);
		refreshDom.appendChild(svgDom);
		refreshDom.appendChild(textDom);
		instance.scrollParentWrap.insertBefore(refreshDom, instance.scrollWrap);
		return {refreshDom, textDom, svgDom};
	}
	return null;
}

const createPullUpRefreshDom = (instance: WScroll, options: OptionsType) => {
	if (instance.scrollWrap) {
		const refreshDom = document.createElement('div');
		const refreshStyle = refreshDom.style;
		setStyle(refreshStyle);
		refreshStyle.height = '30px';
		refreshStyle.bottom = '-30px';
		instance.style && (instance.style.position = 'relative');
		const textDom = createTextDom();
		const svgDom = createSvgDom(options);
		refreshDom.appendChild(svgDom);
		refreshDom.appendChild(textDom);
		instance.scrollWrap.append(refreshDom);
		return {refreshDom, textDom, svgDom};
	}
	return null;
}

const svgAnimTimer = (svgDom: HTMLElement) => {
	let t = 0;
	return setInterval(() => {
		svgDom.style.transform = `rotate(${(360 / 1000) * t % 360}deg)`;
		t += 10;
	}, 10);
}

const ScrollRefresh = (optionConfig: Partial<OptionsType>) => {
	const options: OptionsType = {
		...defaultOptions,
		...optionConfig,
	}
	const {
		pullDownMaxHeight,
		pullUpMaxHeight,
		onPullDown,
		onPullUp,
		loadedText,
		finishText,
		pullingText,
		canLoadText,
		loadingText,
	} = options;
	let isCanPullDown = false;
	let isPullingDown = false; // 是否正在下拉
	let isPullingDownCanLoad = false; // 下拉刷新是否触发
	let isPullDownLoad = false; // 下拉是否正在加载
	let isCanPullUp = false;
	let isPullingUpCanLoad = false; // 上拉刷新是否触发
	let isPullUpLoad = false; // 上拉是否正在加载
	let isFinished = false; // 是否全部加载完毕
	let startTransY = 0;
	return (instance: WScroll, Hooks: HooksType) => {
		Hooks.createEmit('pullDownRefresh');
		Hooks.createEmit('pullUpRefresh');
		const pullDownDom = createPullDownRefreshDom(instance, options);
		const pullUpDom = createPullUpRefreshDom(instance, options);
		if (!pullDownDom || !pullUpDom) {
			return;
		}

		const onPullDownLoad = async () => {
			const { textDom, svgDom } = pullDownDom;
			if (onPullDown && !isPullDownLoad) {
				isPullDownLoad = true;
				textDom && (textDom.innerText = loadingText);
				let animTimer = null;
				svgDom && (animTimer = svgAnimTimer(svgDom));
				isFinished = !!await onPullDown();
				if (isFinished) {
					pullUpDom.textDom && (pullUpDom.textDom.innerText = finishText);
				}
				textDom && (textDom.innerText = loadedText);
				svgDom.style.display = 'none';
				animTimer !== null && clearInterval(animTimer);
				animTimer = null;
				setTimeout(() => {
					finishPullDown();
				}, 500);
			}
		}
		const finishPullDown = () => {
			isPullDownLoad = false;
			isPullingDownCanLoad = false;
			instance.setWH();
			const { refreshDom, svgDom } = pullDownDom;
			if (refreshDom && isPullingDown) {
				refreshDom.style.transition = 'top .2s';
				refreshDom.style.top = `${-options.iconWidth}px`;
				isPullingDown = false;
				setTimeout(() => {
					refreshDom.style.transition = 'none';
					svgDom.style.display = 'block';
				}, 200)
			}
		}
		const onPullUpLoad = async () => {
			const { textDom, svgDom } = pullUpDom;
			if (onPullUp && !isPullUpLoad) {
				isPullUpLoad = true;
				svgDom.style.display = 'block';
				textDom && (textDom.innerText = loadingText);
				let animTimer = null;
				svgDom && (animTimer = svgAnimTimer(svgDom));
				console.log(instance.parentScrollWH);
				if (instance.maxY > 0) {
					instance.setTransform(instance.transX, -instance.maxY - 30, 0, false);
				}
				isFinished = !!await onPullUp();
				if (isFinished) {
					textDom && (textDom.innerText = finishText);
				} else {
					textDom && (textDom.innerText = loadedText);
				}
				svgDom.style.display = 'none';
				animTimer !== null && clearInterval(animTimer);
				animTimer = null;
				setTimeout(() => {
					finishPullUp();
				}, 500);
			}
		}
		const finishPullUp = () => {
			isPullUpLoad = false;
			const { refreshDom } = pullUpDom;
			isPullingUpCanLoad = false;
			instance.setWH();
			if (!isFinished) {
				if (instance.style) {
					const originTransition = instance.style.transition;
					instance.style.transition = 'transform .2s';
					setTimeout(() => {
						instance.style && (instance.style.transition = originTransition);
					}, 200);
				}
			}
			instance.setTransform(instance.transX, -instance.maxY, 0, false);
		}

		onPullUpLoad();
		Hooks.beforeMove.on(() => {
			const { transY } = instance;
			isCanPullDown = false;
			transY === 0 && (isCanPullDown = true);
			startTransY = transY;
		});
		Hooks.move.on(() => {
			const { transY } = instance;
			// 下拉刷新
			if (isCanPullDown && transY > 0 && !isPullDownLoad) {
				const { refreshDom, textDom, svgDom } = pullDownDom;
				!isPullingDown && (isPullingDown = true);
				if (isPullingDown) {
					textDom.innerText = pullingText;
				}
				if (transY < pullDownMaxHeight + options.iconWidth) {
					refreshDom.style.top = `${transY - options.iconWidth}px`;
					svgDom.style.transform = `rotate(${360 / (pullDownMaxHeight + options.iconWidth) * transY}deg)`;
					isPullingDownCanLoad = false;
				} else if (!isPullDownLoad) {
					// 可以加载
					refreshDom.style.top = `${pullDownMaxHeight}px`;
					textDom && (textDom.innerText = canLoadText);
					isPullingDownCanLoad = true;
					Hooks['pullDownRefresh'].emit(true);
				}
			} else if (transY < -instance.maxY + pullUpMaxHeight && !isPullUpLoad && !isFinished) {
				// 上拉加载
				isPullingUpCanLoad = true;
				Hooks['pullUpRefresh'].emit(true);
			}
		});

		Hooks.afterMove.on(() => {
			if (isPullingDownCanLoad && onPullDown && !isPullDownLoad) {
				onPullDownLoad();
			} else if (isPullingUpCanLoad && onPullUp && !isPullUpLoad) {
				onPullUpLoad();
				if (isPullingDown) {
					finishPullDown();
				}
			} else if (isPullingDown) {
				finishPullDown();
			}
		});
	}
}

export default ScrollRefresh;
