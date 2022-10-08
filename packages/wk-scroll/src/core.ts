import Hooks from './hooks.js';
import { FIFOCache, getDistance } from './utils.js';

interface PosType {
  x: number,
  y: number,
}
interface MovePosType extends PosType{
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

export type WScrollType = typeof WScroll;
export default class WScroll {
  private scrollParentWrap: HTMLElement
  private scrollWrap: HTMLElement|null
  private options: Partial<OptionsType>
  private x: number // 当前x坐标
  private y: number // 当前y坐标
  private maxX: number // 最大水平移动距离
  private maxY: number // 最大垂直移动距离
  private transRegx: RegExp
  private transX: number // transformX
  private transY: number // transformY
  private startX: number // 开始x坐标
  private startY: number // 开始y坐标
  private startTime: number // 开始touch时间
  private endTime: number // 结束touch时间
  private tickX: number // 单次move监听回调x偏移量
  private tickY: number // 单次move监听回调y偏移量
  private closestArr: [number, number, number][] //
  private closestTimer: number|null
  private parentStyle: CSSStyleDeclaration | null
  private style: CSSStyleDeclaration | null // 滚动容器的样式
  constructor(dom:HTMLElement, options: Partial<OptionsType> = defaultOptions) {
    this.options = options;
    this.scrollParentWrap = dom;
    this.scrollWrap = dom.firstElementChild ? dom.firstElementChild as HTMLElement : null;
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
    this.scrollWrap?.getBoundingClientRect();
    if (this.scrollWrap) {
      const parentWH = this.getDomWH(this.scrollParentWrap);
      const { w, h } = this.getDomWH(this.scrollWrap);
      this.maxX = -w + parentWH.w;
      this.maxY = h - parentWH.h;
    }
    if (this.options.isOrigin) {
      this.createOriginScroll();
    } else {
      this.createVirtualScroll();
      this.addEvent();
    }
  }

  createOriginScroll() {
    document.documentElement.style.overflow = 'hidden';
    this.parentStyle && (this.parentStyle.overflow = 'auto');
    this.style && (this.style.overflow = 'hidden');
  }

  createVirtualScroll() {
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
      const [startX, startY, startTime] = this.closestArr[0];
      this.momentum(
        { x: startX, y: startY},
        { x, y },
        (this.endTime - startTime) / 1000);
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
    // this.closestTimer = setInterval(() => {
    //  this.closestX = this.x;
    //  this.closestY = this.y;
    // }, 200);
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

  setTransform(x: number, y: number, z: number = 0) {
    x = Math.min(0, Math.max(x, this.maxX));
    y = Math.min(0, Math.max(y, -this.maxY));
    this.style && (this.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`);
  }

  momentum(start: PosType, end: PosType, time: number) {
    const yV0 = Math.abs(end.y - start.y) / time;
    console.log('yV0', yV0);
    const a = -3000; // 加速度
    // Vt = V0 + at;
    const t = Math.abs((0 - yV0) / a);
    console.log('t', t);
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
}
