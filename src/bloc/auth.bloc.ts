import { distinctUntilChanged, map } from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'
import type AuthUser from '/src/entities/auth-user.entity'

export class AuthBloc extends Bloc {
  user$ = new SvelteSubject<AuthUser | undefined>(undefined)

  isLoggedIn$ = this.user$.pipe(map((user) => !!user)).pipe(distinctUntilChanged())

  displayName$ = this.user$.pipe(
    map((user) => {
      if (!user) {
        return 'میهمان'
      }

      return `${user.name}`
    }),
  )

  initialRoute$ = this.user$.pipe(
    map((user) => {
      if (!user) {
        return '/login'
      }

      return '/panel'
    }),
  )

  logout() {
    if (typeof this.user$.getValue() === 'undefined') {
      return
    }

    this.user$.next(undefined)
  }
}
