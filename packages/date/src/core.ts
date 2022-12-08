import { isString } from "@wk-libs/utils";
import zhCn from "./locale/zh-cn";
import WKDate, { OptionsType } from "./WKDate";

const isWKDate = (date: unknown): date is WKDate => {
  return date instanceof WKDate;
};

const wkDate = function (date: unknown = new Date(), ops: Partial<OptionsType> = {}): WKDate {
  if (isWKDate(date)) {
    return date.clone();
  }
  ops.locale = defaultLocale;
  return new WKDate(date || new Date(), ops);
};

export const wrapper = (date: unknown, instance: WKDate): WKDate => {
  return wkDate(date, {
    locale: instance.locale,
  });
};

export const allLocales: Record<string, LocaleType> = {};
export let defaultLocale = "zh-cn";
allLocales["zh-cn"] = zhCn;

const parseLocale = (preset: string | LocaleType, object?: LocaleType) => {
  let locale = "";
  if (!preset) return defaultLocale;
  if (isString(preset)) {
    const presetLower = preset.toLowerCase();
    if (allLocales[presetLower]) {
      locale = presetLower;
    }
    if (object) {
      allLocales[presetLower] = object;
      locale = presetLower;
    }
  } else {
    const { name } = preset as LocaleType;
    allLocales[name] = preset as LocaleType;
    locale = name;
  }
  if (locale) defaultLocale = locale;
  return locale || defaultLocale;
};

wkDate.locale = parseLocale;

export default wkDate;
