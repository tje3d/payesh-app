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
      <img class="w-24 h-24 rounded-full" src="https://placehold.co/96x96" alt="تصویر" />

      <div
        class="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-blue-500 grid place-content-center text-white cursor-pointer"
      >
        <IconCamera class="w-4 h-4" />
      </div>
    </div>
    <div class="flex flex-col gap-1 justify-center text-center">
      <div>{$displayName}</div>
      <div class="text-xs text-gray-500 font-sans">tje3d@yahoo.com</div>
    </div>
  </div>

  <div class="mx-4 mt-8 flex flex-col gap-4">
    <LightSwitchWrapper let:toggleMode>
      <div
        class="block w-full bg-light-surface-2 dark:bg-dark-surface-2 rounded-lg p-4 shadow-md"
        role="button"
        tabindex="-1"
        on:click|preventDefault|stopPropagation={toggleMode}
      >
        <div class="flex justify-between items-center text-sm h-8">
          <div class="flex items-center">
            <div class="w-8"><IconMoon class="w-5 h-5" /></div>
            <div>حالت تاریک</div>
          </div>
          <Switch bind:checked={$isDark} />
        </div>
      </div>
    </LightSwitchWrapper>

    <div
      class="bg-light-surface-2 dark:bg-dark-surface-2 rounded-lg p-4 shadow-md"
      role="button"
      aria-pressed="false"
      tabindex="0"
      use:Ripple
    >
      <div class="flex justify-between items-center text-sm h-8">
        <div class="flex items-center">
          <div class="w-8"><IconPassword class="w-5 h-5" /></div>
          <div>تغییر کلمه عبور</div>
        </div>
        <IconLeft class="w-4 h-4" />
      </div>
    </div>

    <div
      class="bg-light-surface-2 dark:bg-dark-surface-2 rounded-lg p-4 shadow-md"
      role="button"
      aria-pressed="false"
      tabindex="0"
      use:Ripple
      use:logout
    >
      <div class="flex justify-between items-center text-sm h-8 text-rose-500">
        <div class="flex items-center">
          <div class="w-8"><IconPower class="w-5 h-5" /></div>
          <div>خروج</div>
        </div>
      </div>
    </div>
  </div>
</div>
