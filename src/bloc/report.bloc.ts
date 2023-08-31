import { combineLatest, distinctUntilChanged, map, tap } from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'
import Khadem from '/src/entities/khadem.entity'

export class ReportBloc extends Bloc {
  taghsim$ = new SvelteSubject<string | undefined>(undefined)
  bakhsh$ = new SvelteSubject<string | undefined>(undefined)
  step$ = new SvelteSubject<number>(0)
  selectedPerson$ = new SvelteSubject<Khadem | undefined>(undefined)
  canSelectPerson$ = combineLatest([this.taghsim$, this.bakhsh$]).pipe(
    map(([t, b]) => {
      if (typeof t === 'undefined' || typeof b === 'undefined') {
        return false
      }

      return true
    }),
    distinctUntilChanged(),
  )
  personOptions$ = new SvelteSubject(PersonOptions)
  selectedOptions$ = new SvelteSubject<number[]>([])
  hasSelectedOptions$ = this.selectedOptions$.pipe(map((items) => items.length !== 0))

  personsSearch$ = new SvelteSubject<string | undefined>(undefined)
  personsLoading$ = new SvelteSubject<boolean>(false)
  persons$ = this.personsSearch$.pipe(
    map((search) => {
      this.personsLoading$.next(false)

      if (!search) {
        return SamplePersonList.slice(0, 9)
      }

      this.personsLoading$.next(true)

      const regExp = new RegExp(search, 'ig')
      return SamplePersonList.filter((item) => {
        return regExp.test(item.code) || regExp.test(item.name)
      }).slice(0, 9)
    }),
    tap(() => this.personsLoading$.next(false)),
  )
}

const SamplePersonList: Khadem[] = [
  new Khadem(1, 'سید حسین نیکدل', '321456784948', '/images/sample-avatar.webp'),
  new Khadem(2, 'معین پرکامل', '0291909527', '/images/sample-avatar.webp'),
  new Khadem(3, 'تست سوم', '777777777777', '/images/sample-avatar.webp'),
  new Khadem(4, 'تست چهارم', '127475885888', '/images/sample-avatar.webp'),
]

const PersonOptions = [
  { id: 0, name: 'آراستگی ظاهر' },
  { id: 1, name: 'آب مقدس میدونه کجاست؟' },
  { id: 2, name: 'وضعیت ناخن‌ها' },
  { id: 3, name: 'گزینه بعدی' },
  { id: 4, name: 'یک گزینه با توضیحات بسیار طولانی که باعث چند خطی شدن میشه' },
]
