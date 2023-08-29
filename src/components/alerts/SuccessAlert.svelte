<script lang="ts">
	import Icon from '~icons/heroicons/check-circle-solid';
	import Alert from '/src/components/alerts/Alert.svelte';

	export let closable: boolean = true;
</script>

<Alert type={'success'} {closable}>
	<svelte:fragment slot="title"><slot name="title">تبریک</slot></svelte:fragment>
	<svelte:fragment slot="icon"><Icon class="w-6 h-6 text-white" /></svelte:fragment>
	<slot />
</Alert>
