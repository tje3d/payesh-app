<script lang="ts">
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import { di } from '/src/di/di.default'

  const layout = di(ThemeBloc).layout
</script>

{#await import(`/src/layouts/${$layout}/panel/dashboard/+page.svelte`) then c}
  <svelte:component this={c.default} />
{/await}
