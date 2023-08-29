<script lang="ts">
	import { slide } from 'svelte/transition';
	import IconX from '~icons/heroicons/x-mark';

	export let closable: boolean = true;
	export let type: 'success' | 'error' | 'warning';

	let hide = false;
</script>

{#if !hide}
	<div
		class="flex w-full overflow-hidden bg-white dark:bg-[#30334e] rounded-lg shadow-md relative"
		transition:slide|local
	>
		<div
			class="flex items-center justify-center w-12"
			class:bg-teal-500={type === 'success'}
			class:bg-red-500={type === 'error'}
			class:bg-orange-500={type === 'warning'}
		>
			<slot name="icon" />
		</div>

		<div class="px-4 py-2 -mx-3">
			<div class="mx-3" class:pl-10={closable}>
				<span
					class="font-semibold"
					class:text-teal-500={type === 'success'}
					class:dark:text-teal-300={type === 'success'}
					class:text-red-500={type === 'error'}
					class:dark:text-red-300={type === 'error'}
					class:text-orange-500={type === 'warning'}
					class:dark:text-orange-300={type === 'warning'}
				>
					<slot name="title" />
				</span>
				<p class="text-sm text-gray-600 dark:text-gray-500"><slot /></p>
			</div>
		</div>

		{#if closable}
			<div class="absolute end-2 top-1/2 -mt-5">
				<button type="button" class="btn gray circle ghost" on:click={() => (hide = true)}>
					<IconX class="w-4 h-4" />
				</button>
			</div>
		{/if}
	</div>
{/if}
