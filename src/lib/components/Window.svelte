<script>
	import MenuBar from './MenuBar.svelte';
	import TopBar from './TopBar.svelte';

	let { children } = $props();
</script>

<div class="window active mt-50 h-fit w-full max-w-[1500px]">
	<div class="title-bar flex flex-col items-start justify-start">
		<div class="flex w-full flex-row justify-end">
			<div class="title-bar-controls">
				<button aria-label="Minimize"></button>
				<button aria-label="Maximize"></button>
				<button aria-label="Close"></button>
			</div>
		</div>
		<TopBar />
		<MenuBar />
	</div>
	<div class="window-body flex flex-row">
		{@render children()}
	</div>
</div>
