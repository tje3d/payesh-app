import { Subject, concatMap, endWith, startWith, timer } from 'rxjs'
import { Bloc } from '/src/bloc/bloc.default'
import { ToastTypes, type IToast } from '/src/entities/toast.entity'

export class ToastBloc extends Bloc {
  add = new Subject<IToast>()

  list = this.add.pipe(
    concatMap((item) => timer(item.time * 1000).pipe(startWith(item), endWith(undefined))),
  )

  // ─── Helpers ─────────────────────────────────────────────────────────

  error(message: string, time?: number) {
    this.add.next({ message, time: time || 3, type: ToastTypes.ERROR })
  }

  success(message: string, time?: number) {
    this.add.next({ message, time: time || 3, type: ToastTypes.SUCCESS })
  }
}
