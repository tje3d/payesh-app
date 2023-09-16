import { AuthBloc } from '/src/bloc/auth.bloc'
import { get } from '/src/di/di.default'

export function logout(node: HTMLElement) {
  function onClick(e: MouseEvent) {
    e.preventDefault()

    get(AuthBloc).logout()

    // goto('/login')
  }

  node.addEventListener('click', onClick)

  return {
    destroy() {
      node.removeEventListener('click', onClick)
    },
  }
}
