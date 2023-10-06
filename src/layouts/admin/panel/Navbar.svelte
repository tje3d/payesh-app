<script lang="ts">
  import IconMenu from '~icons/heroicons/bars-3-bottom-left'
  import Pc from '~icons/heroicons/computer-desktop'
  import Mobile from '~icons/heroicons/device-phone-mobile'
  import Ripple from '/src/actions/ripple.action'
  import { SidebarBloc } from '/src/bloc/sidebar.bloc'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import LightSwitch from '/src/components/LightSwitch.svelte'
  import { di } from '/src/di/di.default'

  const layout = di(ThemeBloc).layout

  function sidebarToggle() {
    di(SidebarBloc).toggle()
  }

  function toggleLayout() {
    di(ThemeBloc).toggleLayout()
  }
</script>

<div
  class="flex items-center justify-between px-4 shadow-sm bg-light-surface-2 dark:bg-dark-surface dark:border-b border-b-white/10 dark:text-[#94a2b8] relative h-16"
>
  <div>
    <button tabindex="0" class="btn ghost gray circle" use:Ripple on:click={sidebarToggle}>
      <IconMenu class="w-6 h-6" />
    </button>
  </div>

  <div class="flex items-center gap-4">
    <LightSwitch />

    <button use:Ripple type="button" class="btn gray circle ghost circle" on:click={toggleLayout}>
      <div class="swap swap-rotate">
        <input type="checkbox" checked={$layout === 'inspect'} />

        <Mobile class="swap-on fill-current w-6 h-6" />

        <Pc class="swap-off fill-current w-6 h-6" />
      </div>
    </button>

    <button use:Ripple type="button" class="btn gray ghost circle !p-1">
      <img
        class="object-cover w-10 h-10 rounded-full bg-gray-100"
        alt="تصویر"
        src="https://placehold.co/40x40"
      />
    </button>
  </div>
</div>
