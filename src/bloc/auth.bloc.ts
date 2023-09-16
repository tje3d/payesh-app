import { distinctUntilChanged, map } from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'
import type AuthUser from '/src/entities/auth-user.entity'

export class AuthBloc extends Bloc {
  token = new SvelteSubject<string | undefined>(undefined)
  user = new SvelteSubject<AuthUser | undefined>(undefined)

  isLoggedIn$ = this.token.pipe(map((token) => !!token)).pipe(distinctUntilChanged())

  displayName$ = this.user.pipe(
    map((user) => {
      if (!user) {
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
