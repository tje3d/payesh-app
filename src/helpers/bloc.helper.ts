import {
  Subject,
  catchError,
  defer,
  from,
  of,
  pipe as rxPipe,
  startWith,
  switchMap,
  tap,
  type MonoTypeOperatorFunction,
} from 'rxjs'
import type z from 'zod'
import { SvelteSubject } from '/src/bloc/bloc.default'
import { api } from '/src/helpers/api.helper'
import { loadCache, saveCache, type CacheConfig } from '/src/helpers/cache.helper'
import { filterFormError, filterMessageError, makeError } from '/src/helpers/error.helper'
import { shareIt } from '/src/helpers/observable.helper'
import type { ApiErrors } from '/src/lib/Errors'

export function apiSend<
  T extends z.ZodRawShape,
  SchemaType = z.objectOutputType<T, z.ZodTypeAny, z.UnknownKeysParam>,
>({
  schema,
  pipe,
  apiParams,
}: {
  schema: z.ZodObject<T>
  pipe: MonoTypeOperatorFunction<any>
  apiParams: Parameters<typeof api>
}) {
  const error = new SvelteSubject<z.ZodError | ApiErrors | undefined>(undefined)
  const messageError = filterMessageError(error)
  const formError = filterFormError(error)

  const loading = new SvelteSubject<boolean>(false)
  const submit = new Subject<SchemaType>()
  const request = submit.pipe(
    switchMap((form) => {
      error.next(undefined)

      return from(schema.parseAsync(form)).pipe(
        catchError((err) => {
          error.next(err)

          return of(undefined)
        }),
        switchMap((form) => {
          if (!form) {
            return of(undefined)
          }

          loading.next(true)

          apiParams[1] = Object.assign(apiParams[1] || {}, {
            json: form,
          } as (typeof apiParams)[1])

          return from(api(...apiParams)).pipe(
            pipe,
            catchError((err) => {
              error.next(makeError(err))

              return of(undefined)
            }),
            tap(() => loading.next(false)),
          )
        }),
      )
    }),
    shareIt(),
  )

  return {
    schema,
    error,
    formError,
    messageError,
    loading,
    submit,
    request,
  }
}

export function apiLoad<Output>({
  pipe,
  apiParams,
  cache,
}: {
  pipe?: MonoTypeOperatorFunction<Output | undefined>
  apiParams: Parameters<typeof api>
  cache?: CacheConfig
}) {
  let startCache: undefined | Output

  if (cache) {
    startCache = loadCache(cache)
  }

  const error = new SvelteSubject<z.ZodError | ApiErrors | undefined>(undefined)
  const messageError = filterMessageError(error)
  const formError = filterFormError(error)

  const loading = new SvelteSubject<boolean>(false)

  const request = defer(() => {
    loading.next(true)

    return api(...apiParams).pipe(
      switchMap((data) => {
        if (data.headers.get('Content-Type') === 'application/json') {
          return from(data.json<Output>())
        }

        return from(data.text() as Promise<Output>)
      }),
      tap(() => loading.next(false)),
      tap((data) => {
        if (!cache) {
          return
        }

        saveCache(cache, data)
      }),
      startWith(startCache),
      catchError((err) => {
        error.next(makeError(err))

        return of(undefined)
      }),
      pipe || rxPipe(),
    )
  }).pipe(shareIt())

  return {
    error,
    formError,
    messageError,
    loading,
    request,
  }
}
