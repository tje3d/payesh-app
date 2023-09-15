import { Observable, Subject, defer } from 'rxjs'
import { take } from 'rxjs/operators'
import { onDestroy, onMount } from 'svelte'

export const onMount$ = defer(() => {
  const subject = new Subject<void>()
  onMount(() => {
    subject.next()
  })
  return subject.pipe(take(1))
})

export const onDestroy$ = defer(() => {
  const subject = new Subject<void>()
  onDestroy(() => {
    subject.next()
  })
  return subject.pipe(take(1))
})

// Unsubscribe on destroy
export function unDestroy<T>(observable: Observable<T>, callback?: (input: T) => void) {
  const sub = observable.subscribe(callback)

  onDestroy(() => {
    sub.unsubscribe()
  })
}
