export default function KeyboardEvents(
	node: HTMLElement,
	keyType: 'keyup' | 'keydown' = 'keydown'
) {
	node.addEventListener(keyType, onKey);

	function onKey(e: KeyboardEvent) {
		switch (e.key) {
			case 'Escape':
			case 'Enter':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft':
			case 'ArrowUp':
			case 'Backspace':
			case 'Delete':
			case ' ':
			case 'End':
			case 'Home':
			case 'PageUp':
			case 'PageDown':
			case 'Tab':
				const key = e.key === ' ' ? 'Space' : e.key;
				node.dispatchEvent(new CustomEvent(key, { detail: e }));
				break;
		}
	}

	return {
		destroy() {
			// ...
			node.removeEventListener(keyType, onKey);
		}
	};
}
