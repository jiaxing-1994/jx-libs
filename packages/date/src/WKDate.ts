import * as C from "./constant";
import Utils from "./utils";
import wkDate, { wrapper, defaultLocale, allLocales } from "./core";
import { Indexable } from "../types";

export interface OptionsType {
  locale: string;
  isUTC: boolean;
}

class WKDate {
  private date: unknown; // 原始值
  private isUTC: boolean;
  public $d: Date; // 原始值转Date结构
  public $Y: number;
  public $M: number;
  public $D: number;
  public $W: number;
  public $H: number;
  public $m: number;
  public $s: number;
  public $ms: number;
  public locale: string;
  constructor(date: unknown, opts: Partial<OptionsType>) {
    this.date = date;
    this.$d = Utils.pd(date);
    this.isUTC = !!opts.isUTC;
    this.init();
    this.locale = opts.locale || defaultLocale;
  }

  init() {
    const { $d } = this;
    this.$Y = $d.getFullYear();
    this.$M = $d.getMonth();
    this.$D = $d.getDate();
    this.$W = $d.getDay();
    this.$H = $d.getHours();
    this.$m = $d.getMinutes();
    this.$s = $d.getSeconds();
    this.$ms = $d.getMilliseconds();
  }

  getLocaleObj(): LocaleType {
    return allLocales[this.locale];
  }

  clone(date?: unknown): WKDate {
    return wrapper(date || this.date, this);
  }

  valueOf(): number {
    return this.$d.getTime();
  }

  unix() {
    return Math.floor(this.valueOf() / 1e3);
  }

  $set(unit: string, int: number) {
    unit = Utils.pu(unit);
    const utcPad = `set${this.isUTC ? "UTC" : ""}`;
    const name = {
      [C.D]: `${utcPad}Date`,
      [C.DATE]: `${utcPad}Date`,
      [C.M]: `${utcPad}Month`,
      [C.Y]: `${utcPad}FullYear`,
      [C.H]: `${utcPad}Hours`,
      [C.MIN]: `${utcPad}Minutes`,
      [C.S]: `${utcPad}Seconds`,
      [C.MS]: `${utcPad}Milliseconds`,
    }[unit];
    if (name) {
      // @ts-ignore
      this.$d[name](int);
      this.init();
    }
    return this;
  }

  set(unit: string, int: number) {
    return this.clone().$set(unit, int);
  }

  get() {
    return this.date;
  }

  toDate(): Date {
    return new Date(this.valueOf());
  }

  format(formatStr?: string, formatDate?: string) {
    const locale = this.getLocaleObj();
    if (this.isValid()) {
      return locale.invalidDate || C.INVALID_DATE_STRING;
    }
    const dateInstance = formatDate ? this.clone(formatDate) : this;
    const pad$H = (len: number) => {
      return Utils.ps(dateInstance.$H % 12 || 12, len, "0");
    };
    const matches: Indexable = {
      YYYY: dateInstance.$Y,
      YY: String(dateInstance.$Y).slice(-2),
      M: dateInstance.$M + 1,
      MM: Utils.ps(dateInstance.$M + 1, 2, "0"),
      D: dateInstance.$D,
      DD: Utils.ps(dateInstance.$D, 2, "0"),
      d: dateInstance.$W,
      dd: locale.weekdaysMin[dateInstance.$W],
      ddd: locale.weekdaysShort[dateInstance.$W],
      dddd: locale.weekdays[dateInstance.$W],
      H: dateInstance.$H,
      HH: Utils.ps(dateInstance.$H, 2, "0"),
      h: pad$H(1),
      hh: pad$H(2),
      m: dateInstance.$m,
      mm: Utils.ps(dateInstance.$m, 2, "0"),
      s: dateInstance.$s,
      ss: Utils.ps(dateInstance.$s, 2, "0"),
      SSS: Utils.ps(dateInstance.$ms, 3, "0"),
    };
    const str = formatStr || C.DEFAULT_FORMAT;
    return str.replace(C.REGEX_FORMAT, (match) => {
      return matches[match] || match;
    });
  }

  add(num: number, unit: string) {
    unit = Utils.pu(unit);
    if (unit === C.M) {
      return this.set(C.M, this.$M + num);
    }
    if (unit === C.Y) {
      return this.set(C.Y, this.$Y + num);
    }
    if (unit === C.D) {
      return this.set(C.D, this.$D + num);
    }
    if (unit === C.W) {
      return this.set(C.D, this.$D + num * 7);
    }
    const step = {
      [C.MIN]: C.MILLISECONDS_A_MINUTE,
      [C.H]: C.MILLISECONDS_A_HOUR,
      [C.S]: C.MILLISECONDS_A_SECOND,
    }[unit];
    if (step) {
      return wrapper(this.$d.getTime() + num * step, this);
    }
    return this;
  }

  subtract(num: number, unit: string) {
    return this.add(num * -1, unit);
  }

  startOf(unit = "", isStartOf = true) {
    unit = Utils.pu(unit);
    const instanceFactory = (date: number, month: number) => {
      return wrapper(
        this.isUTC ? Date.UTC(this.$Y, month, date) : new Date(this.$Y, month, date),
        this
      );
    };
    const instanceFactoryD = (method: string, slice: number) => {
      const startTime = [0, 0, 0, 0];
      const endTime = [23, 59, 59, 999];
      return wrapper(
        // @ts-ignore
        this.toDate()[method].apply(this.toDate(), (isStartOf ? startTime : endTime).slice(slice)),
        this
      );
    };
    const utcPad = `set${this.isUTC ? "UTC" : ""}`;
    switch (unit) {
      case C.Y:
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
      case C.M:
        return isStartOf ? instanceFactory(1, this.$M) : instanceFactory(0, this.$M + 1);
      case C.D:
      case C.DATE:
        return instanceFactoryD(`${utcPad}Hours`, 0);
      case C.H:
        return instanceFactoryD(`${utcPad}Minutes`, 1);
      case C.MIN:
        return instanceFactoryD(`${utcPad}Seconds`, 2);
      case C.S:
        return instanceFactoryD(`${utcPad}Milliseconds`, 3);
      default:
        return this.clone();
    }
  }

  endOf(unit?: string) {
    return this.startOf(unit, false);
  }

  isValid() {
    return this.$d.toString() === C.INVALID_DATE_STRING;
  }

  isBefore(that: unknown, unit?: string) {
    return this.endOf(unit) < wkDate(that);
  }

  isAfter(that: unknown, unit?: string) {
    return this.startOf(unit) > wkDate(that);
  }

  isSame(that: unknown, unit?: string) {
    const other = wkDate(that);
    return this.endOf(unit) >= other && this.startOf(unit) <= other;
  }

  diff(input: unknown, unit = "", float = false) {
    unit = Utils.pu(unit);
    const that = wkDate(input);
    const diff = this.valueOf() - that.valueOf();
    let mDiff = Utils.md(this, that);
    this > that && (mDiff = -mDiff);
    const result =
      {
        [C.Y]: mDiff / 12,
        [C.M]: mDiff,
        [C.Q]: mDiff / 3,
        [C.W]: diff / C.MILLISECONDS_A_WEEK,
        [C.D]: diff / C.MILLISECONDS_A_DAY,
        [C.H]: diff / C.MILLISECONDS_A_HOUR,
        [C.MIN]: diff / C.MILLISECONDS_A_MINUTE,
        [C.S]: diff / C.MILLISECONDS_A_SECOND,
      }[unit] || diff;

    return float ? result : Utils.af(result);
  }

  diffForStr(input: unknown, unit = "") {
    unit = Utils.pu(unit);
    const locale = this.getLocaleObj();
    const getStr = (num: number, unit: string): string => {
      if (num) {
        return `${num}${locale[unit]}`;
      }
      return "";
    };
    const diffNums: [string, number][] = [
      [C.Y, this.diff(input, C.Y, true)],
      [C.M, this.diff(input, C.M, true)],
      [C.D, this.diff(input, C.D, true)],
      [C.H, this.diff(input, C.H, true)],
      [C.MIN, this.diff(input, C.MIN, true)],
      [C.S, this.diff(input, C.S, true)],
    ];
    let result = getStr(Math.floor(diffNums[0][1]), C.Y);
    let preRest = diffNums[0][1] - Math.floor(diffNums[0][1]);
    if (unit === C.Y) {
      return result;
    }
    for (let i = 1, len = diffNums.length; i < len; i += 1) {
      const r = (diffNums[i][1] / diffNums[i - 1][1]) * preRest;
      if (diffNums[i][1] > 0) {
        result += getStr(Math.trunc(r), diffNums[i][0]);
        preRest = r - Math.trunc(r);
      }
      if (diffNums[i][0] === unit) {
        break;
      }
    }
    return result;
  }
}

export default WKDate;
