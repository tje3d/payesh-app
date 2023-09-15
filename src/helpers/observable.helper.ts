import {
  EMPTY,
  Observable,
  defer,
  from,
  fromEvent,
  pipe,
  shareReplay,
  switchMap,
  timer,
  type MonoTypeOperatorFunction,
} from 'rxjs'

export function shareIt<T>(): MonoTypeOperatorFunction<T> {
  return pipe(shareReplay({ refCount: true, bufferSize: 1 }))
}

export const onServiceWorkerControllerChange = defer(() => {
  if (!('serviceWorker' in navigator)) {
    return EMPTY
  }

  return fromEvent(navigator.serviceWorker, 'controllerchange')
}).pipe(shareIt())

export const serviceWorkerRegistration = new Observable<ServiceWorkerRegistration>((observer) => {
  const sub = timer(0, 1000)
    .pipe(switchMap(() => from(navigator.serviceWorker.getRegistration())))
    .subscribe((register) => {
      if (register) {
        if (!sub.closed) {
          observer.next(register)
        }

        sub.unsubscribe()
      }
    })

  return () => {
    sub.unsubscribe()
  }
}).pipe(shareIt())
