import wkDate from '../src/core';

declare type Indexable = {
	[key: string]: any,
}

declare module '@wk-libs/date' {
	export default wkDate
}
