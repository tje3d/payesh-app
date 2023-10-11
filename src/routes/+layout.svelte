<script lang="ts">
  import '/src/assets/css/app.scss'

  import { map, switchMap, take, timer } from 'rxjs'
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { OfflineReportBloc } from '/src/bloc/offline.report.bloc'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import ToastPrinter from '/src/components/ToastPrinter.svelte'
  import { di } from '/src/di/di.default'
  import {
    onServiceWorkerControllerChange,
    serviceWorkerRegistration,
  } from '/src/helpers/observable.helper'
  import { unDestroy } from '/src/helpers/svelte.helper'
  import init from '/src/loaders/init.loaders'

  const blocs = [di(AuthBloc).init, di(ThemeBloc).init, di(OfflineReportBloc).init]

  blocs.forEach((sub) => unDestroy(sub))

  const isAuthReady = di(AuthBloc).init

  unDestroy(onServiceWorkerControllerChange.pipe(take(1)), () => {
    console.log('🎉🎉 Application Updated Successful 🎉🎉')
    location.reload()
  })

  unDestroy<ServiceWorkerRegistration>(
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

{#if $isAuthReady}
  <slot />
{/if}
