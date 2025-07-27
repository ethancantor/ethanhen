<script>
	import { page } from '$app/stores';
	import Window from '$lib/components/window/Window.svelte';
</script>

<Window bodyDirection="column">
	<h1>{$page.status}: {$page.error?.message}</h1>

	{#if $page.status === 404}
		<p>The page you're looking for doesn't exist.</p>
		<a href="/">Go to homepage</a>
	{:else}
		<p>Something went wrong.</p>
	{/if}
</Window>
