import WScroll, { ScrollRefresh, MovePosType } from '../src/core';
import { HooksType } from '../src/hooks';
import { EmitFnType } from '../src/emit';

export {
	HooksType,
	EmitFnType,
	MovePosType,
	WScroll,
}

declare module '@wk-libs/scroll' {
	export type {
		HooksType,
		EmitFnType,
		MovePosType,
	}
	export {
		ScrollRefresh,
	};
	export default WScroll;
}

declare module "*.svg" {
	const content: any;
	export default content;
}
