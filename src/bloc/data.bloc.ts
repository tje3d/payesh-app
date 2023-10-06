import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  of,
  pipe,
  startWith,
  switchMap,
} from 'rxjs'
import { Bloc } from './bloc.default'
import { ReportBloc } from '/src/bloc/report.bloc'
import { di } from '/src/di/di.default'
import type { IKhadem } from '/src/entities/khadem.entity'
import { apiLoad } from '/src/helpers/bloc.helper'
import { shareIt } from '/src/helpers/observable.helper'

export class DataBloc extends Bloc {
  inspectItems = apiLoad<{ id: number; title: string }[] | undefined>({
    apiParams: ['/1/inspect_items'],
    cache: 'inspectItems',
  })

  organs = apiLoad<
    | {
        managements: { id: number; title: string }[]
        offices: { id: number; management_id: number; title: string }[]
        posts: { id: number; office_id: number; title: string }[]
      }
    | undefined
  >({
    apiParams: ['/1/organs'],
    cache: 'organs',
  })

  person = apiLoad<IKhadem[] | undefined>({
    apiParams: ['/1/person'],
    cache: 'person',
  })

  inspectStatOverview = apiLoad<
    | {
        today: number
        yesterday: number
        last_week: number
        last_month: number
      }
    | undefined
  >({
    apiParams: ['/1/stat_reports'],
    cache: 'stat_reports',
    before: di(ReportBloc).send.request.pipe(startWith(true)),
  })

  reportDetails = apiLoad<{ title: string; false: number; true: number }[]>({
    apiParams: ['/1/report_by_details'],
    cache: 'report_by_details',
    pipe: pipe(
      switchMap((result: any[] | undefined) => {
        return of(
          result?.map((item) => {
            return {
              title: item.item.title,
              false: item.false + item.null,
              true: item.true,
            }
          }),
        )
      }),
    ),
  })

  hasFocus = fromEvent(window, 'focus').pipe(startWith(true), shareIt())

  resize = fromEvent(window, 'resize').pipe(debounceTime(30), shareIt())

  isMobile = this.resize.pipe(
    startWith(false),
    map(
      () =>
        document.documentElement.scrollWidth < 1024 || document.documentElement.scrollHeight < 500,
    ),
    distinctUntilChanged(),
    shareIt(),
  )
}
