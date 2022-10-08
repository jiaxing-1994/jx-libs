export function FIFOCache(stack: any[], target: any, limit: number = 30, strategy: string = 'FIFO') {
	const FIFO = () => {
		if (stack.length >= limit) {
			stack.shift();
		}
		stack.push(target);
	}
	const LIFO = () => {
		if (stack.length >= limit) {
			stack.pop();
		}
		stack.push(target);
	}
	switch (strategy) {
		case 'FIFO': return FIFO();
		case 'LIFO': return LIFO();
	}
};

// 通过速度求位移和时间
// 参数：开始位置，结束位置，持续时间，加速度
export const getDistance = (start: number, end: number, time: number, a:number = -3000) => {
	const yV0 = Math.abs(end - start) / time;
	// Vt = V0 + at;
	const t = Math.abs((0 - yV0) / a);
	// s = v0 * t + 1/2 * a * t^2
	const s = yV0 * t + 0.5 * a * (t * t);
	return [s, t];
}
