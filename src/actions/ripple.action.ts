import { Ripple as Core } from '$lib/Ripple'
import { ThemeBloc } from '/src/bloc/theme.bloc'
import { get } from '/src/di/di.default'

const rippleCore = new Core()

export default function Ripple(node: HTMLElement, isDark: boolean | 'auto' = 'auto') {
  function onClick(this: HTMLElement, event: Event) {
    const finalMode =
      isDark === 'auto'
        ? get(ThemeBloc).isDark.value
          ? 'light'
          : 'dark'
        : isDark
        ? 'dark'
        : 'light'

    rippleCore.create(event, finalMode)
  }

  node.addEventListener('pointerdown', onClick)

  return {
    destroy() {
      node.removeEventListener('pointerdown', onClick)
    },
  }
}
