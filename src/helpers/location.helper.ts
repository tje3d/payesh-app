import { distinctUntilChanged, fromEvent, map, startWith } from 'rxjs'
import { shareIt } from '/src/helpers/observable.helper'

export const locationHash = fromEvent(window, 'hashchange')
  .pipe(
    startWith(undefined),
    map(() => {
      return new URLSearchParams(location.hash.slice(1))
    }),
  )
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
  locationHash
    .subscribe((list) => {
      list.set(key, '1')

      location.hash = list.toString()
    })
    .unsubscribe()
}

export function removeHash(key: string) {
  locationHash
    .subscribe((list) => {
      list.delete(key)

      location.hash = list.toString()
    })
    .unsubscribe()
}
