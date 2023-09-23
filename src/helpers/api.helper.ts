import type { DownloadProgress, KyResponse } from 'ky'
import ky from 'ky'
import { Observable, catchError, from, map, of, switchMap } from 'rxjs'
import { AuthBloc } from '/src/bloc/auth.bloc'
import { di } from '/src/di/di.default'
import { shareIt } from '/src/helpers/observable.helper'

export function downloadFile(
  url: string,
  onDownloadProgress?: (progress: DownloadProgress, chunk: Uint8Array) => void,
) {
  return new Observable<string>((observer) => {
    let objectUrl: string | undefined
    let abort = new AbortController()

    const sub = from(ky.get(url, { onDownloadProgress, signal: abort.signal, retry: Infinity }))
      .pipe(
        switchMap((response) => {
          return from(response.blob()).pipe(map((blob) => URL.createObjectURL(blob)))
        }),
      )
      .subscribe((result) => {
        observer.next((objectUrl = result))
        sub.unsubscribe()
      })

    return () => {
      abort.abort()
      sub.unsubscribe()
      objectUrl && URL.revokeObjectURL(objectUrl)
    }
  }).pipe(shareIt())
}

export function fetchKy(url: Parameters<typeof ky>[0], options?: Parameters<typeof ky>[1]) {
  return new Observable<KyResponse>((observer) => {
    let abort = new AbortController()

    options = Object.assign(options || {}, {
      retry: {
        limit: Infinity,
        backoffLimit: 10000,
      },
      signal: abort.signal,
    } as typeof options)

    const sub = from(ky(url, options))
      .pipe(
        catchError((e) => {
          observer.error(e)
          return of(undefined)
        }),
      )
      .subscribe((response) => {
        if (response && !observer.closed) {
          observer.next(response)
        }

        sub.unsubscribe()
      })

    return () => {
      abort.abort()
      sub.unsubscribe()
    }
  }).pipe(shareIt())
}

export function api(url: Parameters<typeof fetchKy>[0], options?: Parameters<typeof fetchKy>[1]) {
  url = import.meta.env.VITE_API_URL + url + "/"
  const token = di(AuthBloc).token.value

  if (token) {
    options = Object.assign(options || {}, {
      headers: {
        Authorization: 'Token ' + token,
      },
    } as typeof options)
  }

  return fetchKy(url, options)
}
