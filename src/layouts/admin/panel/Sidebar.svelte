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
    class="bg-black bg-opacity-50 fixed top-0 right-0 bottom-0 left-0 z-[19] md:hidden"
    on:click={onBackdropClick}
    role="button"
    tabindex="-1"
    transition:fade|local
  />
{/if}

{#if $isOpen}
  <div
    class="sidebar fixed top-0 bottom-0 w-72 bg-gray-900 flex flex-col z-[20] border-l border-white/10"
    transition:fly|local={{ x: 288, opacity: 1 }}
  >
    <!-- Header - Start -->
    {#if !$isMobile}
      <a href="/panel/dashboard" class="flex items-center h-20 p-6 pb-0">
        <img
          src="/images/logo.png"
          class="invert w-16 mx-auto max-h-full object-contain"
          alt="Logo"
        />
      </a>
    {/if}
    <!-- Header - End -->

    <!-- Content - Start -->
    <div class="flex-auto text-white overflow-auto">
      <ul>
        {#each $items as item, i (item)}
          {#if !item.href && !item.childs}
            <li class="pt-6" />

            <li class="py-3 px-4 text-xs mx-3 item-sidebar-title">
              <span class="font-bold text-primary uppercase">{item.text}</span>
            </li>
          {:else}
            <li class="mb-1">
              <a
                class={`flex mx-3 items-center cursor-pointer justify-start py-2.5 px-4 text-sm hover:bg-white/10 rounded-lg select-none ${
                  $actives.includes(item) ? 'bg-white/10' : 'opacity-75 hover:opacity-100'
                }`}
                href={item.href}
                rel={item.childs ? 'external' : null}
                on:click={item.childs ? () => onItemHasChildClick(item) : onItemClick}
              >
                <svelte:component this={item.icon} class="h-6 w-6 ml-4" />
                <span class="flex-auto">{item.text}</span>

                {#if item.childs}
                  {#if $actives.includes(item)}
                    <IconChevronDown class="w-4 h-4" />
                  {:else}
                    <IconChevronRight
                      class="w-4 h-4 transform rtl:rotate-180 rtl:rotate-z-[90deg]"
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
                      class={`flex mx-3 items-center justify-start py-2.5 px-4 pl-14 text-sm rounded-lg hover:bg-white/10 ${
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
