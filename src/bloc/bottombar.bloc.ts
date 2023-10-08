import { Bloc, SvelteSubject } from './bloc.default'

export class BottomBarBloc extends Bloc {
  show = new SvelteSubject<boolean>(true)
  backMode = new SvelteSubject<boolean | string>(false)
}
