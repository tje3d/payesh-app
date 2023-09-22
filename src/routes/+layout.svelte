<script lang="ts">
  import { map, switchMap, take, timer } from 'rxjs'
  import {
    onServiceWorkerControllerChange,
    serviceWorkerRegistration,
  } from '/src/helpers/observable.helper'
  import { unDestroy } from '/src/helpers/svelte.helper'

  import '/src/assets/css/app.scss'
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import { di } from '/src/di/di.default'
  import init from '/src/loaders/init.loaders'
  import { OfflineReportBloc } from '/src/bloc/offline.report.bloc'
  import ToastPrinter from '/src/components/ToastPrinter.svelte'

  const blocs = [di(AuthBloc).init, di(ThemeBloc).init, di(OfflineReportBloc).init]

  blocs.forEach((sub) => unDestroy(sub))

  unDestroy(onServiceWorkerControllerChange.pipe(take(1)), () => {
    console.log('🎉🎉 Application Updated Successful 🎉🎉')
    location.reload()
  })

  unDestroy(
    serviceWorkerRegistration.pipe(
      switchMap((register) => timer(0, 1000 * 20).pipe(map(() => register))),
    ),
    (register) => {
      register.update()
    },
  )

  init()
</script>

<ToastPrinter />

<slot />
