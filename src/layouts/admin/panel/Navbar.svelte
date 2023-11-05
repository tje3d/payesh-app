<script lang="ts">
  import { createFloatingActions } from 'svelte-floating-ui'
  import { shift } from 'svelte-floating-ui/core'
  import IconMenu from '~icons/heroicons/bars-3-bottom-left'
  import Pc from '~icons/heroicons/computer-desktop'
  import Mobile from '~icons/heroicons/device-phone-mobile'
  import Ripple from '/src/actions/ripple.action'
  import { SvelteSubject } from '/src/bloc/bloc.default'
  import { SidebarBloc } from '/src/bloc/sidebar.bloc'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import LightSwitch from '/src/components/LightSwitch.svelte'
  import ProfilePopover from '/src/components/popovers/ProfilePopover.svelte'
  import { di } from '/src/di/di.default'

  const layout = di(ThemeBloc).layout

  const showProfileMenu = new SvelteSubject<boolean>(false)
  const [profileRef, profileContent] = createFloatingActions({
    strategy: 'absolute',
    middleware: [shift({ padding: { left: 10 } })],
  })

  function sidebarToggle() {
    di(SidebarBloc).toggle()
  }

  function toggleLayout() {
    di(ThemeBloc).toggleLayout()
  }
</script>

<div
  class="relative flex h-16 items-center justify-between border-b-white/10 bg-light-surface-2 px-4 shadow-sm dark:border-b dark:bg-dark-surface dark:text-[#94a2b8]"
>
  <div>
    <button tabindex="0" class="btn ghost gray circle" use:Ripple on:click={sidebarToggle}>
      <IconMenu class="h-6 w-6" />
    </button>
  </div>

  <div class="relative flex items-center gap-4">
    <LightSwitch />

    <button use:Ripple type="button" class="btn gray circle ghost circle" on:click={toggleLayout}>
      <div class="swap swap-rotate">
        <input type="checkbox" checked={$layout === 'inspect'} />

        <Mobile class="swap-on h-6 w-6 fill-current" />

        <Pc class="swap-off h-6 w-6 fill-current" />
      </div>
    </button>

    <button
      use:Ripple
      type="button"
      class="btn gray ghost circle !p-1"
      use:profileRef
      on:click={() => showProfileMenu.next(true)}
    >
      <img
        class="h-10 w-10 rounded-full bg-gray-100 object-cover"
        alt="تصویر"
        src="https://placehold.co/40x40"
      />
    </button>

    {#if $showProfileMenu}
      <ProfilePopover
        origin="origin-top-left"
        content={profileContent}
        on:outside={() => showProfileMenu.next(false)}
        close={() => showProfileMenu.next(false)}
      />
    {/if}
  </div>
</div>
