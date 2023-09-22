import {
  EMPTY,
  Observable,
  Subject,
  combineLatest,
  defer,
  from,
  fromEvent,
  map,
  pipe,
  shareReplay,
  startWith,
  switchMap,
  timer,
  type MonoTypeOperatorFunction,
} from 'rxjs'

export function shareIt<T>(refCount: boolean = true): MonoTypeOperatorFunction<T> {
  return pipe(shareReplay({ refCount, bufferSize: 1 }))
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

export const onStorage = new Subject<string>()

export const isDeviceOnline = combineLatest([
  fromEvent(window, 'online').pipe(startWith(null)),
  fromEvent(window, 'offline').pipe(startWith(null)),
]).pipe(
  startWith(navigator.onLine),
  map(() => {
    return navigator.onLine === true
  }),
  shareIt(),
)
