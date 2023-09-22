import { dev } from '$app/environment'
import { HTTPError } from 'ky'
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  concatMap,
  defer,
  finalize,
  from,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'
import type { IInspectOffline } from '/src/entities/inspect.offline.entity'
import { api } from '/src/helpers/api.helper'
import { loadCacheJsonIfAny } from '/src/helpers/cache.helper'
import { onStorage, shareIt } from '/src/helpers/observable.helper'

export class OfflineReportBloc extends Bloc {
  error = new SvelteSubject<string | undefined>(undefined)

  storageKey: string = 'offlineReports'

  items = defer(() => {
    const start: IInspectOffline[] = loadCacheJsonIfAny(this.storageKey) || []

    return onStorage.pipe(
      startWith(null),
      map((key) => {
        if (key !== null && key === this.storageKey) {
          return (loadCacheJsonIfAny(this.storageKey) as IInspectOffline[] | null) || []
        }

        return start
      }),
    )
  }).pipe(shareIt())

  count = this.items.pipe(
    map((items) => items.length),
    shareIt(),
  )

  add = new Subject<IInspectOffline>()

  init: Observable<boolean>

  flushLoading = new SvelteSubject<boolean>(false)
  flushSubmit = new Subject<boolean>()
  flush = this.flushSubmit.pipe(
    switchMap(() => {
      return this.items.pipe(
        switchMap((fullItems) => {
          const slice = fullItems.slice(0, 5)

          this.flushLoading.next(true)

          return combineLatest(
            slice.map((item, index) => {
              return api('/1/inspect', {
                method: 'post',
                json: item,
              }).pipe(
                switchMap((response) => from(response.json())),

                map((response: any) => {
                  return index
                }),
                catchError((err) => {
                  if (err instanceof HTTPError) {
                    // Remove if its client problem
                    if ((err.response.status + '').startsWith('4')) {
                      return of(index)
                    }
                  }

                  return of(-1)
                }),
              )
            }),
          ).pipe(
            tap((result) => {
              // ─── Remove Items ────

              let output: (IInspectOffline | undefined)[] = fullItems
              let hasAny = false

              result.forEach((index) => {
                if (index !== -1) {
                  output[index] = undefined
                  hasAny = true
                }
              })

              // Update only if anything changed
              if (hasAny) {
                localStorage.setItem(
                  this.storageKey,
                  JSON.stringify(output.filter((item) => !!item)),
                )
                onStorage.next(this.storageKey)
              } else {
                this.error.next('مشکلی در ارسال اطلاعات بوجود آمده است')
              }
            }),
            finalize(() => this.flushLoading.next(false)),
          )
        }),
      )
    }),
    shareIt(),
  )

  constructor() {
    super()

    this.init = this._initBase.pipe(
      switchMap(() => {
        return new Observable<boolean>((observer) => {
          // ─── Init ────────────────────────────

          const addObservable = this.items.pipe(
            switchMap((items) => {
              return this.add.pipe(
                concatMap((add) => {
                  items.push(add)

                  localStorage.setItem(this.storageKey, JSON.stringify(items))

                  onStorage.next(this.storageKey)

                  return of(true)
                }),
              )
            }),
          )

          this.sub(addObservable, () => dev && console.log('Offline Item Added'))

          this.sub(this.flush)

          !observer.closed && observer.next(true)

          return () => {
            // ...
          }
        })
      }),
    )
  }
}
