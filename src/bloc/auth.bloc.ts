import { Observable, combineLatest, distinctUntilChanged, map, switchMap } from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'
import type AuthUser from '/src/entities/auth-user.entity'

export class AuthBloc extends Bloc {
  token = new SvelteSubject<string | undefined>(undefined)
  user = new SvelteSubject<AuthUser | undefined>(undefined)

  ready = new SvelteSubject<boolean>(false)
  isLoggedIn = this.token.pipe(map((token) => !!token)).pipe(distinctUntilChanged())

  displayName = combineLatest([this.user, this.token]).pipe(
    map(([user, token]) => {
      if (!user) {
        if (token) {
          return 'بی نام'
        }

        return 'میهمان'
      }

      return `${user.name}`
    }),
  )

  init: Observable<boolean>

  constructor() {
    super()

    this.init = this._initBase.pipe(
      switchMap(() => {
        return new Observable<boolean>((observer) => {
          // ─── Init ────────────────────────────

          const token = localStorage.getItem('token') || null

          if (token && typeof token === 'string') {
            this.token.next(token)
          }

          // We are ready lets go
          this.ready.next(true)

          this.sub(this.token, (token) => {
            if (token) {
              localStorage.setItem('token', token)
            } else {
              localStorage.removeItem('token')
            }
          })

          !observer.closed && observer.next(true)

          return () => {
            // ...
          }
        })
      }),
    )
  }

  logout() {
    if (typeof this.token.value === 'undefined') {
      return
    }

    this.token.next(undefined)
    this.user.next(undefined)
  }
}
