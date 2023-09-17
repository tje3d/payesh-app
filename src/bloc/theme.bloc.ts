import { Observable, distinctUntilChanged, fromEvent, switchMap } from 'rxjs'
import { Bloc, SvelteSubject } from '/src/bloc/bloc.default'

export class ThemeBloc extends Bloc {
  isDark = new SvelteSubject<boolean>(false)

  onPreferChange = fromEvent<MediaQueryListEvent>(
    window.matchMedia('(prefers-color-scheme: dark)'),
    'change',
  )

  init: Observable<boolean>

  constructor() {
    super()

    this.init = this._initBase.pipe(
      switchMap(() => {
        return new Observable<boolean>((observer) => {
          // ─── Init ────────────────────────────

          this.isDark.next(localStorage.getItem('isDark') === 'true')

          this.sub(this.isDark.pipe(distinctUntilChanged()), (isDark) => {
            localStorage.setItem('isDark', isDark + '')

            document.documentElement.className = isDark ? 'dark' : 'light'
          })

          this.sub(this.onPreferChange, (event) => {
            if (event.matches) {
              this.dark()
            } else {
              this.light()
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

  light() {
    this.isDark.next(false)
  }

  dark() {
    this.isDark.next(true)
  }

  toggle() {
    this.isDark.value ? this.light() : this.dark()
  }
}
