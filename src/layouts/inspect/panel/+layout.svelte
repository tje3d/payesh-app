<script lang="ts">
  import IconHome from '~icons/heroicons/home'
  import IconHomeSolid from '~icons/heroicons/home-solid'
  import IconPlus from '~icons/heroicons/plus-circle'
  import IconPlusSolid from '~icons/heroicons/plus-circle-solid'
  import IconUser from '~icons/heroicons/user'
  import IconUserSolid from '~icons/heroicons/user-solid'
  import BottomBarItem from '/src/components/BottomBarItem.svelte'
</script>

<div class="pb-20">
  <slot />
</div>

<div
  class="fixed right-0 bottom-0 left-0 z-10 bg-white dark:bg-[#2c2f47] flex justify-between items-center px-6 h-20 rounded-t-2xl shadow-[0_35px_60px_-10px_rgba(0,0,0,0.9)]"
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
