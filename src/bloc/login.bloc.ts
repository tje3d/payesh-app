import { goto } from '$app/navigation'
import { Subject, catchError, finalize, from, map, of, shareReplay, switchMap, timeout } from 'rxjs'
import z from 'zod'
import { Bloc, SvelteSubject } from './bloc.default'
import { zodFormat } from '/src/helpers/validator.helper'

export class LoginBloc extends Bloc {
  error$ = new SvelteSubject<ZodFieldError | string | undefined>(undefined)
  formError$ = this.error$.pipe(
    map((err) => (typeof err !== 'undefined' && typeof err !== 'string' ? err : {})),
  )

  static loginSchema = z.object({
    rememberMe: z.boolean(),
    username: z.string().nonempty(),
    password: z.string().nonempty(),
  })
  loginLoading$ = new SvelteSubject<boolean>(false)
  loginSubmit$ = new Subject<typeof LoginBloc.loginSchema._type>()
  login$ = this.loginSubmit$.pipe(
    switchMap((form) => {
      this.error$.next(undefined)

      return from(LoginBloc.loginSchema.parseAsync(form)).pipe(
        catchError((err) => {
          if (err instanceof z.ZodError) {
            err.format(zodFormat)
            this.error$.next(err.formErrors.fieldErrors)
          } else {
            console.error(err)
          }

          return of(undefined)
        }),
        switchMap((form) => {
          if (!form) {
            return of(undefined)
          }

          this.loginLoading$.next(true)

          return from(
            new Promise((resolve) => {
              setTimeout(resolve, 300)
            }),
          ).pipe(
            timeout(4000),
            map((result) => {
              goto('/panel/dashboard')

              return 'با موفقیت وارد شدید'
            }),
            catchError((err) => {
              console.error(err)

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
