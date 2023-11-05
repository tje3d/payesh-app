<script lang="ts">
  import Icon from '~icons/heroicons/exclamation-triangle'
  import Alert from '/src/components/alerts/Alert.svelte'

  export let closable: boolean = true
</script>

<Alert type={'warning'} {closable}>
  <svelte:fragment slot="title"><slot name="title">هشدار</slot></svelte:fragment>
  <svelte:fragment slot="icon"><Icon class="h-6 w-6 text-white" /></svelte:fragment>
  <slot />
</Alert>
