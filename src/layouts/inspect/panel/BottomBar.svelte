<script lang="ts">
  import { afterNavigate, goto } from '$app/navigation'
  import { fromEvent, map, pairwise, startWith } from 'rxjs'
  import { fly } from 'svelte/transition'
  import IconPlus from '~icons/heroicons/document-plus'
  import IconPlusSolid from '~icons/heroicons/document-plus-solid'
  import IconHome from '~icons/heroicons/home'
  import IconHomeSolid from '~icons/heroicons/home-solid'
  import IconUser from '~icons/heroicons/user'
  import IconBack from '~icons/heroicons/arrow-right'
  import IconUserSolid from '~icons/heroicons/user-solid'
  import { SvelteSubject } from '/src/bloc/bloc.default'
  import { DataBloc } from '/src/bloc/data.bloc'
  import { di } from '/src/di/di.default'
  import { routeId } from '/src/helpers/observable.helper'
  import { unDestroy } from '/src/helpers/svelte.helper'
  import BottomBarItem from '/src/layouts/inspect/panel/BottomBarItem.svelte'
  import { BottomBarBloc } from '/src/bloc/bottombar.bloc'
  import Ripple from '/src/actions/ripple.action'

  const bloc = di(BottomBarBloc)

  const show = bloc.show
  const backMode = bloc.backMode

  let menuItemList = [
    {
      href: '/panel/dashboard',
      text: 'صفحه نخست',
      icon: IconHome,
      iconActive: IconHomeSolid,
    },
    {
      href: '/panel/report',
      text: 'ثبت گزارش',
      icon: IconPlus,
      iconActive: IconPlusSolid,
    },
    {
      href: '/panel/profile',
      text: 'حساب کاربری',
      icon: IconUser,
      iconActive: IconUserSolid,
    },
  ]

  const activeIndex = routeId.pipe(
    map((id) => menuItemList.findIndex((item) => id?.startsWith(item.href))),
  )

  const scroll = fromEvent(document.body, 'scroll').pipe(
    map(() => document.body.scrollTop),
    startWith(undefined, undefined),
    pairwise(),
  )

  function onBackClick() {
    if (typeof $backMode === 'string') {
      goto($backMode)
    } else {
      history.back()
    }
  }

  unDestroy(di(DataBloc).resize, () => {
    show.next(true)
  })

  unDestroy(scroll, ([prev, next]) => {
    if (!prev || !next) {
      return
    }

    if (next > prev) {
      show.next(false)
    } else if (next < prev) {
      show.next(true)
    }
  })

  afterNavigate(() => {
    show.next(true)
  })
</script>

{#if $show && !$backMode}
  <div class="fixed bottom-4 left-4 right-4 z-10" transition:fly|local={{ y: 100 }}>
    <div
      class="flex h-16 items-center justify-between rounded-2xl bg-light-2 px-6 text-light-text drop-shadow-bottombar dark:bg-dark-2 dark:text-dark-text"
    >
      {#each menuItemList as menu, index (menu.href)}
        <BottomBarItem
          href={menu.href}
          text={menu.text}
          icon={menu.icon}
          iconActive={menu.iconActive}
          active={index === $activeIndex}
        />
      {/each}
    </div>
  </div>
{:else if $show && $backMode}
  <div
    class="fixed bottom-4 left-4 right-4 z-10"
    role="button"
    tabindex="-1"
    transition:fly|local={{ y: 100 }}
    on:click={onBackClick}
  >
    <div
      class="flex h-12 items-center justify-center rounded-2xl bg-light-2 px-6 text-light-text drop-shadow-bottombar dark:bg-dark-2 dark:text-dark-text"
      use:Ripple
    >
      <IconBack class="h-5 w-5" />
    </div>
  </div>
{/if}
