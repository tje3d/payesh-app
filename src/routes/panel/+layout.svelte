<script lang="ts">
  import { goto } from '$app/navigation'
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import { di } from '/src/di/di.default'
  import { unDestroy } from '/src/helpers/svelte.helper'

  const isLoggedIn = di(AuthBloc).isLoggedIn
  const layout = di(ThemeBloc).layout

  unDestroy(isLoggedIn, (status) => {
    if (!status) {
      goto('/login')
    }
  })
</script>

{#if $isLoggedIn}
  {#await import(`../../layouts/${$layout}/panel/+layout.svelte`) then c}
    <svelte:component this={c.default}>
      <slot />
    </svelte:component>
  {/await}
{/if}
