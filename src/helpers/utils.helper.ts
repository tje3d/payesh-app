import type { Subscription } from 'rxjs'
import type { Unsubscriber } from 'svelte/store'

export function toUnsubscriber(sub: Subscription): Unsubscriber {
  return () => {
    sub.unsubscribe()
  }
}
