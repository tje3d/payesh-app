import {
  Subject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  finalize,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs'
import type { z } from 'zod'
import { Bloc, SvelteSubject } from './bloc.default'
import { DataBloc } from '/src/bloc/data.bloc'
import { di } from '/src/di/di.default'
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
  canSelectPerson = combineLatest([this.management, this.office, this.post]).pipe(
    map(([t, b, p]) => {
      if (typeof t === 'undefined' || typeof b === 'undefined' || typeof p === 'undefined') {
        return false
      }

      return true
    }),
    distinctUntilChanged(),
  )
  selectedOptions = new SvelteSubject<number[]>([])
  hasSelectedOptions = this.selectedOptions.pipe(map((items) => items.length !== 0))

  personsSearch = new SvelteSubject<string | undefined>(undefined)
  personsLoading = new SvelteSubject<boolean>(false)
  persons = this.personsSearch.pipe(
    switchMap((search) => {
      this.personsLoading.next(false)

      return di(DataBloc).person.pipe(
        map((persons) => {
          if (!search) {
            return persons?.slice(0, 9) || []
          }

          const regExp = new RegExp(search, 'ig')
          return (
            persons
              ?.filter((item) => {
                return (
                  regExp.test(item.code) ||
                  regExp.test(item.first_name) ||
                  regExp.test(item.last_name)
                )
              })
              .slice(0, 9) || []
          )
        }),
        tap(() => this.personsLoading.next(false)),
      )
    }),
  )

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
              this.selectedPerson.next(undefined)

              return 'گزارش با موفقیت ثبت شد'
            }),
            catchError((err) => {
              this.error.next(makeError(err))

              return of(undefined)
            }),
            finalize(() => this.sendLoading.next(false)),
          )
        }),
      )
    }),
    shareIt(),
  )

  // ─── Helpers ─────────────────────────────────────────────────────────

  resetForNewReport() {
    this.selectedPerson.next(undefined)
    this.selectedOptions.next([])
  }
}
