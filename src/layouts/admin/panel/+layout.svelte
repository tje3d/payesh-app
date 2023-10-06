<script lang="ts">
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { SidebarBloc } from '/src/bloc/sidebar.bloc'
  import { di } from '/src/di/di.default'
  import Navbar from '/src/layouts/admin/panel/Navbar.svelte'
  import Sidebar from '/src/layouts/admin/panel/Sidebar.svelte'

  const isLoggedIn = di(AuthBloc).isLoggedIn
  const isSidebarOpen = di(SidebarBloc).isOpen
</script>

{#if $isLoggedIn}
  <div class="flex min-h-full w-full">
    <Sidebar />

    <div
      class="flex-auto transition-all w-full bg-light-surface dark:bg-dark-surface"
      class:md:pr-72={$isSidebarOpen}
    >
      <Navbar />

      <div class="w-full max-w-screen-xl mx-auto px-6 pb-8">
        <slot />
      </div>
    </div>
  </div>
{/if}
