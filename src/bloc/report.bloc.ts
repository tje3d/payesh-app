import { Subject, catchError, from, map, of, switchMap, tap } from 'rxjs'
import type { z } from 'zod'
import { Bloc, SvelteSubject } from './bloc.default'
import { InspectNewSchema, type IInspectNew } from '/src/entities/inspect.new.entity'
import type { IKhadem } from '/src/entities/khadem.entity'
import { api } from '/src/helpers/api.helper'
import { filterFormError, filterMessageError, makeError } from '/src/helpers/error.helper'
import { shareIt } from '/src/helpers/observable.helper'
import type { ApiErrors } from '/src/lib/Errors'

export class ReportBloc extends Bloc {
  error = new SvelteSubject<z.ZodError | ApiErrors | undefined>(undefined)
  messageError = filterMessageError(this.error)
  formError = filterFormError(this.error)

  management = new SvelteSubject<string | undefined>(undefined)
  office = new SvelteSubject<string | undefined>(undefined)
  post = new SvelteSubject<string | undefined>(undefined)
  selectedPerson = new SvelteSubject<IKhadem | undefined>(undefined)
  selectedOptions = new SvelteSubject<number[]>([])
  hasSelectedOptions = this.selectedOptions.pipe(map((items) => items.length !== 0))

  step = new SvelteSubject<number>(0)

  // ─── Send ────────────────────────────────────────────────────────────────────

  sendLoading = new SvelteSubject<boolean>(false)
  sendSubmit = new Subject<IInspectNew>()
  send = this.sendSubmit.pipe(
    switchMap((form) => {
      this.error.next(undefined)

      return from(InspectNewSchema.parseAsync(form)).pipe(
        catchError((err) => {
          this.error.next(err)

          return of(undefined)
        }),
        switchMap((form) => {
          if (!form) {
            return of(undefined)
          }

          this.sendLoading.next(true)

          return from(
            api('/1/inspect', {
              method: 'post',
              json: form,
            }),
          ).pipe(
            switchMap((response) => from(response.json())),
            map((response: any) => {
              return 'گزارش با موفقیت ثبت شد'
            }),
            catchError((err) => {
              this.error.next(makeError(err))

              return of(undefined)
            }),
            tap(() => this.sendLoading.next(false)),
          )
        }),
      )
    }),
    shareIt(),
  )
}
