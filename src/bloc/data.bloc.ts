import { defer, from, map, shareReplay, startWith, switchMap, tap } from 'rxjs'
import { Bloc } from './bloc.default'
import type { IKhadem } from '/src/entities/khadem.entity'
import { api } from '/src/helpers/api.helper'
import { loadCacheJsonIfAny } from '/src/helpers/cache.helper'

export class DataBloc extends Bloc {
  inspectItems = defer(() => {
    const start = loadCacheJsonIfAny('inspectItems')

    return api('/1/inspect_items').pipe(
      switchMap((response) => from(response.json())),
      startWith(start),
      map((data) => data as { id: number; title: string }[] | undefined),
    )
  }).pipe(
    tap((item) => {
      if (!item) {
        localStorage.removeItem('inspectItems')
      } else {
        localStorage.setItem('inspectItems', JSON.stringify(item))
      }
    }),
    shareReplay({ bufferSize: 1, refCount: false }),
  )

  organs = defer(() => {
    const start = loadCacheJsonIfAny('organs')

    return api('/1/organs').pipe(
      switchMap((response) => from(response.json())),
      startWith(start),
      map(
        (data) =>
          data as
            | {
                managements: { id: number; title: string }[]
                offices: { id: number; management_id: number; title: string }[]
                posts: { id: number; office_id: number; title: string }[]
              }
            | undefined,
      ),
    )
  }).pipe(
    tap((item) => {
      if (!item) {
        localStorage.removeItem('organs')
      } else {
        localStorage.setItem('organs', JSON.stringify(item))
      }
    }),
    shareReplay({ bufferSize: 1, refCount: false }),
  )

  person = defer(() => {
    const start = loadCacheJsonIfAny('person')

    return api('/1/person').pipe(
      switchMap((response) => from(response.json())),
      startWith(start),
      map((data) => data as IKhadem[] | undefined),
    )
  }).pipe(
    tap((item) => {
      if (!item) {
        localStorage.removeItem('person')
      } else {
        localStorage.setItem('person', JSON.stringify(item))
      }
    }),
    shareReplay({ bufferSize: 1, refCount: false }),
  )
}
