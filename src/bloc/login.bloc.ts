import { HTTPError } from 'ky'
import { Subject, catchError, finalize, from, map, of, shareReplay, switchMap } from 'rxjs'
import z from 'zod'
import { Bloc, SvelteSubject } from './bloc.default'
import { AuthBloc } from '/src/bloc/auth.bloc'
import { di } from '/src/di/di.default'
import { api } from '/src/helpers/api.helper'
import { filterFormError, filterMessageError, makeError } from '/src/helpers/error.helper'
import { MessageError, type ApiErrors } from '/src/lib/Errors'

export class LoginBloc extends Bloc {
  error = new SvelteSubject<z.ZodError | ApiErrors | undefined>(undefined)
  messageError = filterMessageError(this.error)
  formError = filterFormError(this.error)

  static loginSchema = z.object({
    rememberMe: z.boolean(),
    username: z.string().nonempty(),
    password: z.string().nonempty(),
  })
  loginLoading$ = new SvelteSubject<boolean>(false)
  loginSubmit$ = new Subject<typeof LoginBloc.loginSchema._type>()
  login$ = this.loginSubmit$.pipe(
    switchMap((form) => {
      this.error.next(undefined)

      return from(LoginBloc.loginSchema.parseAsync(form)).pipe(
        catchError((err) => {
          this.error.next(err)

          return of(undefined)
        }),
        switchMap((form) => {
          if (!form) {
            return of(undefined)
          }

          this.loginLoading$.next(true)

          return from(
            api('/1/login', {
              method: 'post',
              json: form,
            }),
          ).pipe(
            switchMap((response) => from(response.json())),
            map((response: any) => {
              di(AuthBloc).token.next(response.token)

              return 'با موفقیت وارد شدید'
            }),
            catchError((err) => {
              // goto('/panel/dashboard')
              // return 'با موفقیت وارد شدید'
              if (err instanceof HTTPError) {
                if (err.response.status === 400) {
                  this.error.next(new MessageError('نام کاربری یا رمزعبور اشتباه است'))
                } else {
                  this.error.next(makeError(err))
                }
              } else {
                this.error.next(makeError(err))
              }

              return of(undefined)
            }),
            finalize(() => this.loginLoading$.next(false)),
          )
        }),
      )
    }),
    shareReplay({ refCount: true, bufferSize: 1 }),
  )
}
