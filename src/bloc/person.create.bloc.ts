import { Subject, catchError, from, map, of, switchMap, tap } from 'rxjs'
import z from 'zod'
import { Bloc, SvelteSubject } from './bloc.default'
import { api } from '/src/helpers/api.helper'
import { filterFormError, filterMessageError, makeError } from '/src/helpers/error.helper'
import { shareIt } from '/src/helpers/observable.helper'
import type { ApiErrors } from '/src/lib/Errors'

export class PersonCreateBloc extends Bloc {
  error = new SvelteSubject<z.ZodError | ApiErrors | undefined>(undefined)
  messageError = filterMessageError(this.error)
  formError = filterFormError(this.error)

  static createSchema = z.object({
    first_name: z.string().nonempty().max(50),
    last_name: z.string().nonempty().max(50),
    code: z.string().nonempty().max(50),
  })
  createLoading = new SvelteSubject<boolean>(false)
  createSubmit = new Subject<typeof PersonCreateBloc.createSchema._type>()
  create = this.createSubmit.pipe(
    switchMap((form) => {
      this.error.next(undefined)

      return from(PersonCreateBloc.createSchema.parseAsync(form)).pipe(
        catchError((err) => {
          this.error.next(err)

          return of(undefined)
        }),
        switchMap((form) => {
          if (!form) {
            return of(undefined)
          }

          this.createLoading.next(true)

          return from(
            api('/1/person', {
              method: 'post',
              json: form,
            }),
          ).pipe(
            switchMap((response) => from(response.json())),
            map((response: any) => {
              return 'با موفقیت ایجاد شد'
            }),
            catchError((err) => {
              this.error.next(makeError(err))

              return of(undefined)
            }),
            tap(() => this.createLoading.next(false)),
          )
        }),
      )
    }),
    shareIt(),
  )
}
