import { goto } from '$app/navigation'
import { AuthBloc } from '/src/bloc/auth.bloc'
import { get } from '/src/di/di.default'

export function logout(node: HTMLElement) {
  function onClick(e: MouseEvent) {
    e.preventDefault()

    goto('/login')

    setTimeout(() => {
      get(AuthBloc).logout()
    }, 100)
  }

  node.addEventListener('click', onClick)

  return {
    destroy() {
      node.removeEventListener('click', onClick)
    },
  }
}
