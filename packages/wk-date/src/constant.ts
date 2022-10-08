export const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const REGEX_FORMAT = /Y{1,4}|M{1,2}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|SSS/g;

export const SECONDS_A_MINUTE = 60
export const SECONDS_A_HOUR = SECONDS_A_MINUTE * 60
export const SECONDS_A_DAY = SECONDS_A_HOUR * 24
export const SECONDS_A_WEEK = SECONDS_A_DAY * 7

export const MILLISECONDS_A_SECOND = 1e3;
export const MILLISECONDS_A_MINUTE = MILLISECONDS_A_SECOND * SECONDS_A_MINUTE;
export const MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
export const MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
export const MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND;

export const D = 'day';
export const W = 'week';
export const M = 'month';
export const Y = 'year';
export const DATE = 'date';
export const H = 'hour';
export const MIN = 'minute';
export const S = 'second';
export const MS = 'millisecond';
export const Q = 'quarter'

export const INVALID_DATE_STRING = 'Invalid Date';
