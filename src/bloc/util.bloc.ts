import { Observable, shareReplay } from 'rxjs'
import { Bloc } from './bloc.default'
import { getMobileOperatingSystem } from '/src/helpers/utils.helper'

export class UtilBloc extends Bloc {
  isMobile$ = new Observable((observer) => {
    observer.next(typeof getMobileOperatingSystem() === 'undefined' ? false : true)

    return () => {
      // ...
    }
  }).pipe(shareReplay({ refCount: true, bufferSize: 1 }))
}
