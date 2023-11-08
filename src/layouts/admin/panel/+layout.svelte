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
      class="w-full flex-auto bg-light transition-all duration-300 ease-out dark:bg-dark"
      class:md:pr-72={$isSidebarOpen}
    >
      <Navbar />

      <div class="mx-auto w-full max-w-screen-xl px-6 pb-8">
        <slot />
      </div>
    </div>
  </div>
{/if}
