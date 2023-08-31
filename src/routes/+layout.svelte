<script lang="ts">
  import { onDestroy } from 'svelte'
  import '/src/assets/css/app.scss'

  let refreshing = false

  function onUpdate() {
    if (!refreshing) {
      console.log('🎉🎉 Application Updated Successful 🎉🎉')
      location.reload()
      refreshing = true
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', onUpdate)
  }

  onDestroy(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.removeEventListener('controllerchange', onUpdate)
    }
  })
</script>

<slot />
