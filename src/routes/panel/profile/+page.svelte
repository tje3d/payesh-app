<script lang="ts">
  import IconCamera from '~icons/heroicons/camera'
  import IconLeft from '~icons/heroicons/chevron-left'
  import IconPassword from '~icons/heroicons/finger-print'
  import IconMoon from '~icons/heroicons/moon'
  import IconPower from '~icons/heroicons/power'
  import { logout } from '/src/actions/logout.action'
  import Ripple from '/src/actions/ripple.action'
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import LightSwitchWrapper from '/src/components/LightSwitchWrapper.svelte'
  import Switch from '/src/components/form/switch.svelte'
  import MetaTitle from '/src/components/meta-title.svelte'
  import { di, get } from '/src/di/di.default'

  const themeBloc = get(ThemeBloc)
  const isDark = themeBloc.isDark

  const displayName = di(AuthBloc).displayName
</script>

<MetaTitle titles="حساب کاربری" />

<div class="py-8">
  <div class="flex flex-col items-center justify-center gap-2">
    <div class="relative">
      <img class="h-24 w-24 rounded-full" src="https://placehold.co/96x96" alt="تصویر" />

      <div
        class="absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-content-center rounded-full bg-blue-500 text-white"
      >
        <IconCamera class="h-4 w-4" />
      </div>
    </div>
    <div class="flex flex-col justify-center gap-1 text-center">
      <div>{$displayName}</div>
      <div class="font-sans text-xs text-gray-500">tje3d@yahoo.com</div>
    </div>
  </div>

  <div class="mx-4 mt-8 flex flex-col gap-4">
    <LightSwitchWrapper let:toggleMode>
      <div
        class="block w-full rounded-2xl bg-light-surface-2 p-4 shadow-sm dark:bg-dark-surface-2"
        role="button"
        tabindex="-1"
        on:click|preventDefault|stopPropagation={toggleMode}
      >
        <div class="flex h-8 items-center justify-between text-sm">
          <div class="flex items-center">
            <div class="w-8"><IconMoon class="h-5 w-5" /></div>
            <div>حالت تاریک</div>
          </div>
          <Switch bind:checked={$isDark} />
        </div>
      </div>
    </LightSwitchWrapper>

    <div
      class="rounded-2xl bg-light-surface-2 p-4 shadow-sm dark:bg-dark-surface-2"
      role="button"
      aria-pressed="false"
      tabindex="0"
      use:Ripple
    >
      <div class="flex h-8 items-center justify-between text-sm">
        <div class="flex items-center">
          <div class="w-8"><IconPassword class="h-5 w-5" /></div>
          <div>تغییر کلمه عبور</div>
        </div>
        <IconLeft class="h-4 w-4" />
      </div>
    </div>

    <div
      class="rounded-2xl bg-light-surface-2 p-4 shadow-sm dark:bg-dark-surface-2"
      role="button"
      aria-pressed="false"
      tabindex="0"
      use:Ripple
      use:logout
    >
      <div class="flex h-8 items-center justify-between text-sm text-rose-500">
        <div class="flex items-center">
          <div class="w-8"><IconPower class="h-5 w-5" /></div>
          <div>خروج</div>
        </div>
      </div>
    </div>
  </div>
</div>
