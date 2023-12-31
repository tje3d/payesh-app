import { goto } from '$app/navigation'
import { combineLatest, distinctUntilChanged, fromEvent, map, startWith, take } from 'rxjs'
import { shareIt } from '/src/helpers/observable.helper'
import { navigating$ } from '/src/helpers/svelte.helper'

export const locationHash = combineLatest([
  navigating$,
  fromEvent(window, 'hashchange').pipe(startWith(undefined)),
])
  .pipe(
    map(() => location.hash),
    distinctUntilChanged(),
  )
  .pipe(map((hash) => new URLSearchParams(hash.slice(1))))
  .pipe(shareIt())

export const locationHashObj = locationHash.pipe(
  map((hash) => {
    const output: { [key: string]: any } = {}

    for (const [key, value] of hash.entries()) {
      output[key] = value
    }

    return output
  }),
  shareIt(),
)

export function watchHash(hash: string) {
  return locationHashObj
    .pipe(map((result) => !!result[hash]))
    .pipe(distinctUntilChanged(), shareIt())
}

export function addHash(key: string) {
  locationHash.pipe(take(1)).subscribe((list) => {
    list.set(key, '1')

    goto('#' + list.toString())
  })
}

export function removeHash(key: string) {
  locationHash.pipe(take(1)).subscribe((list) => {
    list.delete(key)

    const newHash = list.toString()

    if (!newHash || newHash === '') {
      goto(location.pathname, {
        replaceState: true,
      })
    } else {
      goto('#' + newHash)
    }
  })
}
