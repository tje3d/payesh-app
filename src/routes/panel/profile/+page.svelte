<script lang="ts">
  import IconCamera from '~icons/heroicons/camera'
  import Ripple from '/src/actions/ripple.action'
  import Switch from '/src/components/form/switch.svelte'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import { get } from '/src/di/di.default'
  import IconLeft from '~icons/heroicons/chevron-left'
  import IconMoon from '~icons/heroicons/moon'
  import IconPassword from '~icons/heroicons/finger-print'
  import IconPower from '~icons/heroicons/power'
  import { goto } from '$app/navigation'
  import { logout } from '/src/actions/logout.action'

  const themeBloc = get(ThemeBloc)
  const themeMode = themeBloc.mode$

  let darkMode: boolean = $themeMode === 'dark'

  function toggleTheme() {
    themeBloc.mode$.next(darkMode ? 'dark' : 'light')
  }
</script>

<div class="py-8">
  <div class="flex flex-col items-center justify-center gap-2">
    <div class="relative">
      <img class="w-24 h-24 rounded-full" src="/images/sample-avatar.webp" alt="تصویر" />

      <div
        class="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-blue-500 grid place-content-center text-white cursor-pointer"
      >
        <IconCamera class="w-4 h-4" />
      </div>
    </div>
    <div class="flex flex-col gap-1 justify-center text-center">
      <div>سید حسین نیکدل</div>
      <div class="text-xs text-gray-500 font-sans">tje3d@yahoo.com</div>
    </div>
  </div>

  <div class="mx-4 mt-8 flex flex-col gap-4">
    <label class="block w-full bg-white dark:bg-[#30334e] rounded-lg p-4" use:Ripple>
      <div class="flex justify-between items-center text-sm h-8">
        <div class="flex items-center">
          <div class="w-8"><IconMoon class="w-5 h-5" /></div>
          <div>حالت تاریک</div>
        </div>
        <Switch bind:checked={darkMode} on:change={toggleTheme} />
      </div>
    </label>

    <div
      class="bg-white dark:bg-[#30334e] rounded-lg p-4"
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
      class="bg-white dark:bg-[#30334e] rounded-lg p-4"
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
