import { isString, isNumber } from "@wk-libs/utils";
import * as C from "./constant";
import type WKDate from "./WKDate";

const parseDate = (date: unknown): Date => {
  if (isString(date) || isNumber(date) || date instanceof Date) {
    return new Date(date);
  }
  return new Date();
};

const padStart = (str: unknown, length: number, pad: string) => {
  const s = String(str);
  return s.padStart(length, pad);
};

const prettyUnit = (unit: string): string => {
  const special: Record<string, string> = {
    M: C.M,
    y: C.Y,
    w: C.W,
    d: C.D,
    D: C.DATE,
    h: C.H,
    m: C.MIN,
    s: C.S,
    ms: C.MS,
    Q: C.Q,
  };
  return (
    special[unit] ||
    String(unit || "")
      .toLowerCase()
      .replace(/s$/, "")
  );
};

const absFloor = (n: number) => (n < 0 ? Math.ceil(n) || 0 : Math.floor(n));

const monthDiff = (a: WKDate, b: WKDate): number => {
  if (a > b) return monthDiff(b, a);
  const wholeMonthDiff = (b.$Y - a.$Y) * 12 + (b.$M - a.$M);
  const anchor = a.clone().add(wholeMonthDiff, C.M);
  const c = b < anchor; // 说明a的天数大于b
  const anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), C.M);
  return +(
    -(
      wholeMonthDiff +
      (b.valueOf() - anchor.valueOf()) /
        (c ? anchor.valueOf() - anchor2.valueOf() : anchor2.valueOf() - anchor.valueOf())
    ) || 0
  );
};

export default {
  pd: parseDate,
  ps: padStart,
  pu: prettyUnit,
  af: absFloor,
  md: monthDiff,
};
