import { BehaviorSubject, Observable, Subscription } from 'rxjs'

export abstract class Bloc {
  subscriptions: Subscription[] = []

  // ─── Sub ─────────────────────────────────────────────────────────────

  sub<T>(obs: Observable<T>, callback?: (input: T) => void) {
    const sub = obs.subscribe(callback)
    this.subscriptions.push(sub)
  }

  // ─── Init ────────────────────────────────────────────────────────────

  protected _initBase = new Observable<boolean>((observer) => {
    !observer.closed && observer.next(true)

    return () => {
      this.subscriptions.forEach((sub) => sub.unsubscribe())
      this.subscriptions = []
    }
  })
}

export class SvelteSubject<T> extends BehaviorSubject<T> {
  set(value: T): void {
    super.next(value)
  }
}

export class BlocClearError {}
