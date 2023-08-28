import { Ripple as Core } from '$lib/Ripple'
import { ThemeBloc, type ThemeMode } from '/src/bloc/theme.bloc'
import { get } from '/src/di/di.default'

const rippleCore = new Core()

export default function Ripple(node: HTMLElement, mode: ThemeMode | 'auto' = 'auto') {
  function onClick(this: HTMLElement, event: Event) {
    const finalMode =
      mode === 'auto' ? (get(ThemeBloc).mode$.getValue() === 'dark' ? 'light' : 'dark') : mode

    rippleCore.create(event, finalMode)
  }

  node.addEventListener('mousedown', onClick)

  return {
    destroy() {
      node.removeEventListener('mousedown', onClick)
    },
  }
}
