import { startWith } from 'rxjs'
import { Bloc } from './bloc.default'
import { ReportBloc } from '/src/bloc/report.bloc'
import { di } from '/src/di/di.default'
import type { IKhadem } from '/src/entities/khadem.entity'
import { apiLoad } from '/src/helpers/bloc.helper'

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
}
