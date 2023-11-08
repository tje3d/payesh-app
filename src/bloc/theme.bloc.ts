import { Observable, distinctUntilChanged, fromEvent, skip, switchMap } from 'rxjs'
import { Bloc, SvelteSubject } from '/src/bloc/bloc.default'

export class ThemeBloc extends Bloc {
  ready = new SvelteSubject<boolean>(false)

  isDark = new SvelteSubject<boolean>(false)

  onPreferChange = fromEvent<MediaQueryListEvent>(
    window.matchMedia('(prefers-color-scheme: dark)'),
    'change',
  )

  layout = new SvelteSubject<Layouts>('inspect')

  init: Observable<boolean>

  constructor() {
    super()

    this.init = this._initBase.pipe(
      switchMap(() => {
        return new Observable<boolean>((observer) => {
          // ─── Init ────────────────────────────

          this.isDark.next(localStorage.getItem('isDark') === 'true')

          this.sub(this.isDark.pipe(skip(1), distinctUntilChanged()), (isDark) => {
            localStorage.setItem('isDark', isDark + '')
          })

          this.sub(this.isDark.pipe(distinctUntilChanged()), (isDark) => {
            const newMode = isDark ? 'dark' : 'light'
            const oppositeMode = newMode === 'dark' ? 'light' : 'dark'

            document.documentElement.classList.remove(oppositeMode)
            document.documentElement.classList.add(newMode)
          })

          // ─── Layout ──────────────────────────

          const userLayout = localStorage.getItem('layout')

          if (userLayout) {
            this.layout.next(userLayout as Layouts)
          }

          this.sub(this.layout.pipe(distinctUntilChanged()), (layout) => {
            localStorage.setItem('layout', layout)
            const oppositeLayout: Layouts = layout === 'inspect' ? 'admin' : 'inspect'

            document.documentElement.classList.remove(oppositeLayout)
            document.documentElement.classList.add(layout)
          })

          this.sub(this.onPreferChange, (event) => {
            if (event.matches) {
              this.dark()
            } else {
              this.light()
            }
          })

          this.ready.next(true)

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

  toggleLayout() {
    this.layout.next(this.layout.value === 'inspect' ? 'admin' : 'inspect')
  }
}

export type Layouts = 'inspect' | 'admin'
