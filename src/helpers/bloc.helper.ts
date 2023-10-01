import { Subject, catchError, from, of, switchMap, tap, type MonoTypeOperatorFunction } from 'rxjs'
import type z from 'zod'
import { SvelteSubject } from '/src/bloc/bloc.default'
import { api } from '/src/helpers/api.helper'
import { filterFormError, filterMessageError, makeError } from '/src/helpers/error.helper'
import { shareIt } from '/src/helpers/observable.helper'
import type { ApiErrors } from '/src/lib/Errors'

export function apiCall<
  T extends z.ZodRawShape,
  SchemaType = z.objectOutputType<T, z.ZodTypeAny, z.UnknownKeysParam>,
>({
  schema,
  pipe,
  apiParams,
}: {
  schema: z.ZodObject<T>
  pipe: MonoTypeOperatorFunction<any>
  apiParams: Required<Parameters<typeof api>>
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

          apiParams[1].json = form

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
