export default function OnlyNumber(
	node: HTMLInputElement | HTMLTextAreaElement,
	input: OnlyNumberProps = { enable: true }
) {
	if (input.enable) {
		node.addEventListener('input', onKeyDown);
		node.setAttribute('inputmode', 'decimal');
	}

	function onKeyDown(this: HTMLInputElement, e: Event) {
		node.value = node.value.replace(/[^0-9۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩]/g, '');
	}

	return {
		destroy() {
			node.removeEventListener('input', onKeyDown);
			node.removeAttribute('inputmode');
		}
	};
}

interface OnlyNumberProps {
	enable?: boolean;
}
