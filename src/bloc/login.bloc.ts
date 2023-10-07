import { HTTPError } from 'ky'
import { catchError, from, map, of, pipe, switchMap } from 'rxjs'
import z from 'zod'
import { Bloc } from './bloc.default'
import { AuthBloc } from '/src/bloc/auth.bloc'
import { di } from '/src/di/di.default'
import { apiSend } from '/src/helpers/bloc.helper'
import { makeError } from '/src/helpers/error.helper'
import { MessageError } from '/src/lib/Errors'

export class LoginBloc extends Bloc {
  login = apiSend({
    schema: z.object({
      rememberMe: z.boolean(),
      username: z.string().nonempty(),
      password: z.string().nonempty(),
    }),

    apiParams: [
      '/1/login',
      {
        method: 'post',
      },
    ],

    catchErr: catchError((err) => {
      if (err instanceof HTTPError) {
        if (err.response.status === 400) {
          this.login.error.next(new MessageError('نام کاربری یا رمزعبور اشتباه است'))

          return of(undefined)
        }
      }

      this.login.error.next(makeError(err))

      return of(undefined)
    }),

    pipe: pipe(
      switchMap((response) => {
        if (!response) {
          return of(undefined)
        }

        return from(response.json()).pipe(
          map((response: any) => {
            di(AuthBloc).token.next(response.token)

            return 'با موفقیت وارد شدید'
          }),
        )
      }),
    ),
  })
}
