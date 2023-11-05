<script lang="ts">
  import type { ContentAction } from 'svelte-floating-ui'
  import IconLogout from '~icons/heroicons/arrow-right-on-rectangle'
  import IconPassword from '~icons/heroicons/lock-closed'
  import IconUser from '~icons/heroicons/user'
  import Popover from './Popover.svelte'
  import { logout } from '/src/actions/logout.action'
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { get } from '/src/di/di.default'

  export let content: ContentAction
  export let origin: string | undefined = undefined
  export let close: () => void

  const authBloc = get(AuthBloc)
  const displayName = authBloc.displayName
</script>

<Popover {origin} {content} on:outside>
  <a
    href="/panel/profile"
    class="flex transform items-center space-x-2 p-4 text-sm text-gray-600 transition-colors duration-300 hover:bg-gray-100 rtl:space-x-reverse dark:text-gray-300 dark:hover:bg-[#3e4264] dark:hover:text-white"
    on:click={close}
  >
    <img
      class="mx-1 h-9 w-9 flex-shrink-0 rounded-full object-cover"
      src="https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBibHVlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=face&w=500&q=200"
      alt="jane avatar"
    />
    <div class="mx-1">
      <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-200">{$displayName}</h1>
      <!-- {#if $mobile}
				<p class="text-sm text-gray-500 dark:text-gray-400">{$mobile}</p>
			{/if} -->
    </div>
  </a>

  <hr class="border-gray-200 dark:border-[#3e4264]" />

  <a
    href="/panel/profile"
    class="flex transform items-center space-x-2 p-4 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 rtl:space-x-reverse dark:text-gray-300 dark:hover:bg-[#3e4264] dark:hover:text-white"
    on:click={close}
  >
    <IconUser class="h-5 w-5 fill-current" />

    <span class="mx-1">ویرایش اطلاعات کاربری</span>
  </a>

  <a
    href="/panel/profile"
    class="flex transform items-center space-x-2 p-4 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 rtl:space-x-reverse dark:text-gray-300 dark:hover:bg-[#3e4264] dark:hover:text-white"
    on:click={close}
  >
    <IconPassword class="h-5 w-5 fill-current" />

    <span class="mx-1">تغییر کلمه عبور</span>
  </a>

  <hr class="border-gray-200 dark:border-[#3e4264]" />

  <a
    href="#"
    class="flex transform items-center space-x-2 p-4 text-sm capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 rtl:space-x-reverse dark:text-gray-300 dark:hover:bg-[#3e4264] dark:hover:text-white"
    use:logout
  >
    <IconLogout class="h-5 w-5 fill-current" />

    <span class="mx-1">خروج</span>
  </a>
</Popover>
