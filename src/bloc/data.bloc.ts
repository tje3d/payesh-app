import { defer, from, map, shareReplay, startWith, switchMap } from 'rxjs'
import { Bloc } from './bloc.default'
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
  }).pipe(shareReplay({ bufferSize: 1, refCount: false }))

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
  }).pipe(shareReplay({ bufferSize: 1, refCount: false }))
}
