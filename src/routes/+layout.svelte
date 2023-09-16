<script lang="ts">
  import { map, switchMap, take, timer } from 'rxjs'
  import {
    onServiceWorkerControllerChange,
    serviceWorkerRegistration,
  } from '/src/helpers/observable.helper'
  import { unDestroy } from '/src/helpers/svelte.helper'

  import '/src/assets/css/app.scss'
  import init from '/src/loaders/init.loaders'

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

<slot />
