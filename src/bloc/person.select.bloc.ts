import { map, switchMap, tap } from 'rxjs'
import type { z } from 'zod'
import { Bloc, SvelteSubject } from './bloc.default'
import { DataBloc } from '/src/bloc/data.bloc'
import { di } from '/src/di/di.default'
import { filterFormError, filterMessageError } from '/src/helpers/error.helper'
import type { ApiErrors } from '/src/lib/Errors'

export class PersonSelect extends Bloc {
  error = new SvelteSubject<z.ZodError | ApiErrors | undefined>(undefined)
  messageError = filterMessageError(this.error)
  formError = filterFormError(this.error)

  personsSearch = new SvelteSubject<string | undefined>(undefined)
  personsLoading = new SvelteSubject<boolean>(false)
  persons = this.personsSearch.pipe(
    switchMap((search) => {
      this.personsLoading.next(true)

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
        tap(() => {
          this.personsLoading.next(false)
        }),
      )
    }),
  )
}
