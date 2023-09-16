import { combineLatest, distinctUntilChanged, map } from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'
import type AuthUser from '/src/entities/auth-user.entity'

export class AuthBloc extends Bloc {
  token = new SvelteSubject<string | undefined>(undefined)
  user = new SvelteSubject<AuthUser | undefined>(undefined)

  isLoggedIn$ = this.token.pipe(map((token) => !!token)).pipe(distinctUntilChanged())

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

  initialRoute$ = this.user.pipe(
    map((user) => {
      if (!user) {
        return '/login'
      }

      return '/panel'
    }),
  )

  logout() {
    if (typeof this.token.value === 'undefined') {
      return
    }

    this.token.next(undefined)
    this.user.next(undefined)
  }
}
