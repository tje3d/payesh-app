import { Observable, animationFrames, fromEvent, take } from 'rxjs'

const scrollPositions: { [key: string]: number | undefined } = {}

export function getScrollPos(key: string) {
  return scrollPositions[key] || 0
}

export function storeScrollPos(key: string, value: number) {
  scrollPositions[key] = value
}

export function restoreScroll(key: string, node?: HTMLElement) {
  return new Observable((observer) => {
    const target = node || document.body

    animationFrames()
      .pipe(take(1))
      .subscribe(() => {
        target.scrollTop = getScrollPos(key)
      })

    const sub = fromEvent(target, 'scroll').subscribe(() => {
      storeScrollPos(key, target.scrollTop)
    })

    return () => {
      sub.unsubscribe()
    }
  })
}
