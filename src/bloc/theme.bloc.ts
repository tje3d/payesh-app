import { map, startWith, type Subscription } from 'rxjs'
import { Bloc, SvelteSubject } from './bloc.default'

export class ThemeBloc extends Bloc {
  mode$ = new SvelteSubject<ThemeMode>('light')
  ripple$ = this.mode$.pipe(
    map((mode) => (mode === 'light' ? 'dark' : 'light')),
    startWith('light' as ThemeMode),
  )
  _themeSub?: Subscription

  constructor() {
    super()

    this._themeSub = this.mode$.subscribe((theme) => {
      document.documentElement.className = theme
    })
  }

  close(): void {
    super.close()

    this._themeSub?.unsubscribe()
  }

  light() {
    this.mode$.next('light')
  }

  dark() {
    this.mode$.next('dark')
  }

  toggle() {
    this.mode$.getValue() === 'light' ? this.dark() : this.light()
  }
}

export type ThemeMode = 'dark' | 'light'
