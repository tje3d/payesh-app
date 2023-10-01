import { from, map, pipe, switchMap } from 'rxjs'
import z from 'zod'
import { Bloc } from './bloc.default'
import { apiSend } from '/src/helpers/bloc.helper'

export class PersonCreateBloc extends Bloc {
  create = apiSend({
    apiParams: ['/1/person', { method: 'post' }],
    pipe: pipe(
      switchMap((response) => from(response.json())),
      map((response: any) => {
        return 'با موفقیت ایجاد شد'
      }),
    ),
    schema: z.object({
      first_name: z.string().nonempty().max(50),
      last_name: z.string().nonempty().max(50),
      code: z.string().nonempty().max(50),
    }),
  })
}
