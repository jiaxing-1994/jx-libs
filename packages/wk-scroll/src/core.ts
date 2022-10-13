import Hooks from './hooks.js';
import { FIFOCache, getDistance } from './utils.js';
import ScrollRefresh from '../extends/pullRefresh/index.js';
import {FnType} from "@src/emit";

export {
  ScrollRefresh,
}

interface PosType {
  x: number,
  y: number,
}
export interface MovePosType extends PosType{
  tickX: number,
  tickY: number,
}
interface OptionsType {
  [key: string]: any,
  scroll: string, // x, y, free
  isOrigin: boolean,
}

const defaultOptions: Partial<OptionsType> = {
  scroll: 'y',
  isOrigin: false,
}

export default class WScroll {
  public scrollParentWrap: HTMLElement
  public scrollWrap: HTMLElement|null
  public options: Partial<OptionsType>
  public parentScrollWH: { w: number, h: number }
  public scrollWH: { w: number, h: number }
  public x: number // 当前x坐标
  public y: number // 当前y坐标
  public maxX: number // 最大水平移动距离
  public maxY: number // 最大垂直移动距离
  public transRegx: RegExp
  public transX: number // transformX
  public transY: number // transformY
  public startX: number // 开始x坐标
  public startY: number // 开始y坐标
  public startTime: number // 开始touch时间
  public endTime: number // 结束touch时间
  public tickX: number // 单次move监听回调x偏移量
  public tickY: number // 单次move监听回调y偏移量
  public closestArr: [number, number, number][] //
  public closestTimer: number|null
  public parentStyle: CSSStyleDeclaration | null
  public style: CSSStyleDeclaration | null // 滚动容器的样式
  constructor(dom:HTMLElement, options: Partial<OptionsType> = defaultOptions) {
    this.options = options;
    this.scrollParentWrap = dom;
    this.scrollWrap = dom.firstElementChild ? dom.firstElementChild as HTMLElement : null;
    this.parentScrollWH = { w: 0, h: 0 };
    this.scrollWH = { w: 0, h: 0 };
    this.x = 0; // 当前x
    this.y = 0; // 当前y
    this.maxX = 0; // 最大x
    this.maxY = 0; // 最大y
    this.tickX = 0; // 单次move监听回调x偏移量
    this.tickY = 0; // 单次move监听回调y偏移量
    this.transX = 0; // 每次滚动x总偏移量
    this.transY = 0; // 每次滚动y总偏移量
    this.startX = 0; // 开始move的x位置
    this.startY = 0; // 开始move的y位置
    this.startTime = new Date().getTime(); // 开始move的时间戳
    this.endTime = new Date().getTime(); // 结束move的时间戳
    this.closestArr = [];
    this.closestTimer = null;
    this.transRegx = /^translate3d\((-?\d*.?\d*)px,\s?(-?\d*.?\d*)px,\s?(-?\d*.?\d*)px\)$/; // 方便从style取值
    this.style = null; // 滚动dom的样式
    this.parentStyle = null; // 滚动dom的外部容器样式
    this.init();
  }

  init() {
    this.parentStyle = this.scrollParentWrap.style;
    this.style = this.scrollWrap?.style || null;
    if (this.options.isOrigin) {
      this.createOriginScroll();
    } else {
      this.createVirtualScroll();
      this.addEvent();
    }
  }

  setWH() {
    if (this.scrollWrap) {
      this.parentScrollWH = this.getDomWH(this.scrollParentWrap);
      this.scrollWH = this.getDomWH(this.scrollWrap);
      this.maxX = -this.scrollWH.w + this.parentScrollWH.w;
      this.maxY = Math.max(0, Math.max(0, this.scrollWH.h - this.parentScrollWH.h));
      console.log('maxY', this.maxY);
    }
  }

  createOriginScroll() {
    document.documentElement.style.overflow = 'hidden';
    this.parentStyle && (this.parentStyle.overflow = 'auto');
    this.style && (this.style.overflow = 'hidden');
  }

  createVirtualScroll() {
    if (this.scrollWrap) {
      this.setWH()
      // this.scrollWrap.addEventListener('DOMNodeInserted',(e) => {
      //   this.setWH();
      // });
    }
    document.documentElement.style.overflow = 'hidden';
    this.parentStyle && (this.parentStyle.overflow = 'hidden');
    const moveFn = (params: MovePosType) => {
      const { tickX, tickY } = params;
      switch (this.options.scroll) {
        case 'y': this.transY += tickY; break;
        case 'x': this.transX += tickX; break;
        case 'free':
          this.transX += tickX;
          this.transY += tickY;
          break;
        default: this.transY += tickY; break;
      };
      this.setTransform(this.transX, this.transY);
    };
    const afterMoveFn = (params: PosType) => {
      const { x, y } = params;
      if (this.closestArr.length) {
        const [startX, startY, startTime] = this.closestArr[0];
        this.momentum(
          { x: startX, y: startY},
          { x, y },
          (this.endTime - startTime) / 1000);
      }
    };
    Hooks.move.on(moveFn);
    Hooks.afterMove.on(afterMoveFn);
  }

  addEvent() {
    this.scrollParentWrap.addEventListener('touchstart', this.start.bind(this));
    this.scrollParentWrap.addEventListener('touchmove', this.move.bind(this));
    this.scrollParentWrap.addEventListener('touchend', this.end.bind(this));
  }

  start(e: TouchEvent) {
    this.style && (this.style.transition = 'none');
    this.closestArr = [];
    const { pageX, pageY } = e.targetTouches[0];
    this.startX = pageX;
    this.startY = pageY;
    this.x = pageX;
    this.y = pageY;
    const { x, y } = this.getTransform();
    this.transX = x;
    this.transY = y;
    this.startTime = new Date().getTime();
    Hooks.beforeMove.emit({
      x: this.x,
      y: this.y,
    });
  }

  move(e: TouchEvent) {
    const { pageX, pageY } = e.targetTouches[0];
    this.tickX = pageX - this.x;
    this.tickY = pageY - this.y;
    this.x = pageX;
    this.y = pageY;
    Hooks.move.emit({
      x: this.x,
      y: this.y,
      tickX: this.tickX,
      tickY: this.tickY,
    });
    FIFOCache(this.closestArr, [this.x, this.y, new Date().getTime()]);
  }

  end(e: TouchEvent) {
    const { pageX, pageY } = e.changedTouches[0];
    this.x = pageX;
    this.y = pageY;
    this.endTime = new Date().getTime();
    if (typeof this.closestTimer === "number") {
      clearInterval(this.closestTimer);
      this.closestTimer = null;
    }
    Hooks.afterMove.emit({
      x: pageX,
      y: pageY,
    });
  }

  getDomWH(dom: HTMLElement): { w: number, h: number } {
    const { width, height } = dom.getBoundingClientRect();
    return {
      w: width,
      h: height,
    }
  }

  getTransform(): { x: number, y: number, z: number } {
    if (this.style) {
      const { transform } = this.style;
      if (transform && this.transRegx.test(transform)) {
        const matched = transform.match(this.transRegx);
        if (matched) {
          const [, x, y, z] = matched;
          return { x: Number(x), y: Number(y), z: Number(z) };
        }
      } else {
        this.style.transform = 'translate3d(0px, 0px, 0px)';
      }
    }
    return { x: 0, y: 0, z: 0 };
  }

  setTransform(x: number, y: number, z: number = 0, limit: boolean = true) {
    if (limit) {
      x = Math.min(0, Math.max(x, this.maxX));
      y = Math.min(0, Math.max(y, -this.maxY));
    }
    this.style && (this.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`);
  }

  momentum(start: PosType, end: PosType, time: number) {
    const yV0 = Math.abs(end.y - start.y) / time;
    const a = -3000; // 加速度
    // Vt = V0 + at;
    const t = Math.abs((0 - yV0) / a);
    // s = v0 * t + 1/2 * a * t^2
    let yS = 0;
    let yT = 0;
    let xS = 0;
    let xT = 0;
    switch (this.options.scroll) {
      case 'x': [xS, xT] = getDistance(start.x, end.x, time, a); break;
      case 'y': [yS, yT] = getDistance(start.y, end.y, time, a); break;
      case 'free':
        [yS, yT] = getDistance(start.y, end.y, time, a);
        [xS, xT] = getDistance(start.x, end.x, time, a);
        break;
    }
    const { x, y } = this.getTransform();
    if (this.style) {
      this.style.transition = `all ${Math.max(xT, yT)}s ease`;
    }
    this.setTransform(x + (end.x > start.x ? xS : -xS), y + (end.y > start.y ? yS : -yS));
    setTimeout(() => {
      this.style && (this.style.transition = 'none');
    }, Math.max(xT, yT) * 1000);
  }

  on(type: string, handler: FnType) {
    Hooks[type] && Hooks[type].on(handler);
  }

  extend(Plugin: any) {
    Plugin(this, Hooks);
  }
}
