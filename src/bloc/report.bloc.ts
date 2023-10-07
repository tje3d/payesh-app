import { from, map, pipe, switchMap } from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'
import { InspectNewSchema } from '/src/entities/inspect.new.entity'
import type { IKhadem } from '/src/entities/khadem.entity'
import { apiSend } from '/src/helpers/bloc.helper'

export class ReportBloc extends Bloc {
  management = new SvelteSubject<number | undefined>(undefined)
  office = new SvelteSubject<number | undefined>(undefined)
  file = new SvelteSubject<File | undefined>(undefined)
  post = new SvelteSubject<number | undefined>(undefined)
  selectedPerson = new SvelteSubject<IKhadem | undefined>(undefined)
  selectedOptions = new SvelteSubject<number[]>([])
  hasSelectedOptions = this.selectedOptions.pipe(map((items) => items.length !== 0))

  step = new SvelteSubject<number>(1)

  send = apiSend({
    apiParams: ['/1/inspect', { method: 'post' }],
    schema: InspectNewSchema,
    pipe: pipe(
      switchMap((response) => from(response.json())),
      map((response: any) => {
        return 'گزارش با موفقیت ثبت شد'
      }),
    ),
  })
}
