import { BehaviorSubject } from 'rxjs';

export abstract class Bloc {
  close(): void {
    // ...
  }
}

export class SvelteSubject<T> extends BehaviorSubject<T> {
  set(value: T): void {
    super.next(value);
  }
}

export class BlocClearError {}
