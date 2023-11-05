<script lang="ts">
  import { afterNavigate } from '$app/navigation'
  import { onDestroy } from 'svelte'
  import { fade, fly, slide } from 'svelte/transition'
  import IconChevronDown from '~icons/heroicons/chevron-down'
  import IconChevronRight from '~icons/heroicons/chevron-right'
  import type { SidebarItem } from '/src/assets/data/sidebar.data'
  import { DataBloc } from '/src/bloc/data.bloc'
  import { SidebarBloc } from '/src/bloc/sidebar.bloc'
  import { di } from '/src/di/di.default'
  import { unDestroy } from '/src/helpers/svelte.helper'

  const sidebarBloc = di(SidebarBloc)

  const actives = sidebarBloc.actives
  const isOpen = sidebarBloc.isOpen

  const isMobile = di(DataBloc).isMobile

  const items = sidebarBloc.items

  function onBackdropClick() {
    sidebarBloc.close()
  }

  function onItemClick() {
    if (window.innerWidth < 960) {
      sidebarBloc.close()
    }
  }

  function onItemHasChildClick(item: SidebarItem) {
    sidebarBloc.toggleItem(item)
  }

  unDestroy(isMobile, (is) => {
    if (is) {
      isOpen.next(false)
    } else {
      isOpen.next(true)
    }
  })

  afterNavigate(() => {
    sidebarBloc.resetManual()
  })

  onDestroy(() => {
    sidebarBloc.resetManual()
  })
</script>

{#if $isOpen && $isMobile}
  <div
    class="fixed bottom-0 left-0 right-0 top-0 z-[19] bg-black bg-opacity-50 md:hidden"
    on:click={onBackdropClick}
    role="button"
    tabindex="-1"
    transition:fade|local
  />
{/if}

{#if $isOpen}
  <div
    class="sidebar fixed bottom-0 top-0 z-[20] flex w-72 flex-col border-l border-white/10 bg-gray-900"
    transition:fly|local={{ x: 288, opacity: 1 }}
  >
    <!-- Header - Start -->
    {#if !$isMobile}
      <a href="/panel/dashboard" class="flex h-20 items-center p-6 pb-0">
        <img
          src="/images/logo.png"
          class="mx-auto max-h-full w-16 object-contain invert"
          alt="Logo"
        />
      </a>
    {/if}
    <!-- Header - End -->

    <!-- Content - Start -->
    <div class="flex-auto overflow-auto text-white">
      <ul>
        {#each $items as item, i (item)}
          {#if !item.href && !item.childs}
            <li class="pt-6" />

            <li class="item-sidebar-title mx-3 px-4 py-3 text-xs">
              <span class="font-bold uppercase text-primary">{item.text}</span>
            </li>
          {:else}
            <li class="mb-1">
              <a
                class={`mx-3 flex cursor-pointer select-none items-center justify-start rounded-2xl px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                  $actives.includes(item) ? 'bg-white/10' : 'opacity-75 hover:opacity-100'
                }`}
                href={item.href}
                rel={item.childs ? 'external' : null}
                on:click={item.childs ? () => onItemHasChildClick(item) : onItemClick}
              >
                <svelte:component this={item.icon} class="ml-4 h-6 w-6" />
                <span class="flex-auto">{item.text}</span>

                {#if item.childs}
                  {#if $actives.includes(item)}
                    <IconChevronDown class="h-4 w-4" />
                  {:else}
                    <IconChevronRight
                      class="rtl:rotate-z-[90deg] h-4 w-4 transform rtl:rotate-180"
                    />
                  {/if}
                {/if}

                {#if item.label}
                  <div class="indicator ml-4">
                    <span
                      class="indicator-item indicator-middle indicator-end badge badge-secondary text-xs"
                    >
                      {item.label}
                    </span>
                  </div>
                {/if}
              </a>
            </li>

            {#if item.childs && $actives.includes(item)}
              <ul class="py-1" transition:slide|local>
                {#each item.childs as child}
                  <li class="mb-1">
                    <a
                      class={`mx-3 flex items-center justify-start rounded-2xl px-4 py-2.5 pl-14 text-sm hover:bg-white/10 ${
                        $actives.includes(child) ? 'bg-white/10' : 'opacity-75 hover:opacity-100'
                      }`}
                      href={child.href}
                      on:click={onItemClick}
                    >
                      <span class="flex-auto">{child.text}</span>
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          {/if}
        {/each}

        <li class="pt-6" />
      </ul>
    </div>
    <!-- Content - end -->
  </div>
{/if}
