import { combineLatest, map } from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'
import { DataBloc } from '/src/bloc/data.bloc'
import { di } from '/src/di/di.default'

export class PersonSelect extends Bloc {
  persons = di(DataBloc).person

  search = new SvelteSubject<string | undefined>(undefined)
  filtered = combineLatest([this.persons.request, this.search]).pipe(
    map(([persons, search]) => {
      if (!search) {
        return persons?.slice(0, 9) || []
      }

      const regExp = new RegExp(search, 'ig')
      return (
        persons
          ?.filter((item) => {
            return (
              regExp.test(item.code) || regExp.test(item.first_name) || regExp.test(item.last_name)
            )
          })
          .slice(0, 9) || []
      )
    }),
  )
}
