export default function focus(node: HTMLElement, enable: boolean = true) {
	let timer: NodeJS.Timeout | undefined;
	if (enable) {
		timer = setTimeout(() => node.focus(), 50);
	}

	return {
		destroy() {
			timer && clearTimeout(timer);
		}
	};
}
