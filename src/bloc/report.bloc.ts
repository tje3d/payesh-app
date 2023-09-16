import { combineLatest, distinctUntilChanged, map, switchMap, tap } from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'
import { DataBloc } from '/src/bloc/data.bloc'
import { di } from '/src/di/di.default'
import type { IKhadem } from '/src/entities/khadem.entity'

export class ReportBloc extends Bloc {
  management = new SvelteSubject<string | undefined>(undefined)
  office = new SvelteSubject<string | undefined>(undefined)
  post = new SvelteSubject<string | undefined>(undefined)
  step$ = new SvelteSubject<number>(0)
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
  selectedOptions$ = new SvelteSubject<number[]>([])
  hasSelectedOptions$ = this.selectedOptions$.pipe(map((items) => items.length !== 0))

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
}
