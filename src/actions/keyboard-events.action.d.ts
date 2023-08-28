declare namespace svelteHTML {
	interface HTMLAttributes {
		'on:Space'?: () => void;
		'on:Escape'?: () => void;
		'on:Enter'?: () => void;
		'on:ArrowRight'?: () => void;
		'on:ArrowDown'?: () => void;
		'on:ArrowLeft'?: () => void;
		'on:ArrowUp'?: () => void;
		'on:Backspace'?: () => void;
		'on:Delete'?: () => void;
		'on:End'?: () => void;
		'on:Home'?: () => void;
		'on:PageUp'?: () => void;
		'on:PageDown'?: () => void;
		'on:Tab'?: () => void;
	}
}
