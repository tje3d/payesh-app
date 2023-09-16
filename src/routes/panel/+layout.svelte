<script lang="ts">
  import IconHome from '~icons/heroicons/home'
  import IconHomeSolid from '~icons/heroicons/home-solid'
  import IconPlus from '~icons/heroicons/plus-circle'
  import IconPlusSolid from '~icons/heroicons/plus-circle-solid'
  import IconUser from '~icons/heroicons/user'
  import IconUserSolid from '~icons/heroicons/user-solid'
  import LightSwitch from '/src/components/light-switch.svelte'
  import { page } from '$app/stores'
  import Ripple from '/src/actions/ripple.action'
  import BottomBarItem from '../../components/BottomBarItem.svelte'
  import { di } from '/src/di/di.default'
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { unDestroy } from '/src/helpers/svelte.helper'
  import { goto } from '$app/navigation'

  const isLoggedIn = di(AuthBloc).isLoggedIn$

  unDestroy(isLoggedIn, (status) => {
    if (!status) {
      goto('/login')
    }
  })
</script>

<div class="pb-16">
  <slot />
</div>

<div
  class="absolute right-0 bottom-0 left-0 z-10 bg-white dark:bg-[#2c2f47] flex justify-between px-6 h-16 rounded-t-2xl"
>
  <BottomBarItem
    href="/panel/dashboard"
    text="صفحه نخست"
    icon={IconHome}
    iconActive={IconHomeSolid}
  />
  <BottomBarItem href="/panel/report" text="ثبت گزارش" icon={IconPlus} iconActive={IconPlusSolid} />
  <BottomBarItem
    href="/panel/profile"
    text="حساب کاربری"
    icon={IconUser}
    iconActive={IconUserSolid}
  />
</div>
