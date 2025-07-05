<script>
	import MenuBar from './MenuBar.svelte';
	import TopBar from './TopBar.svelte';

	let {
		children,
		hasTopBar = true,
		hasMenuBar = true,
		className = '',
		title = '',
		titleIcon = '',
		active = true
	} = $props();
</script>

<div class="window {active ? 'active' : ''} h-fit w-full max-w-[1000px] {className}">
	<div class="title-bar flex flex-col items-start justify-start">
		<div class="flex w-full flex-row items-start justify-between gap-1">
			{#if titleIcon}
				<img src={titleIcon} alt="Title Icon" class="my-auto h-3 w-3" />
			{/if}
			{#if title}
				<span class="my-auto text-sm text-nowrap text-gray-300" style="font-size: 9px;"
					>{title}</span
				>
			{/if}
			<div class="flex w-full flex-row justify-end">
				<div class="title-bar-controls">
					<button aria-label="Minimize"></button>
					<button aria-label="Maximize"></button>
					<button aria-label="Close"></button>
				</div>
			</div>
		</div>
		{#if hasTopBar}<TopBar />{/if}
		{#if hasMenuBar}<MenuBar>
				<li role="menuitem" tabindex="0" class="flex flex-row items-center gap-2">
					Organize <div style="font-size:8px;">▼</div>
				</li>
				<li role="menuitem" tabindex="0" class="flex flex-row items-center gap-2">
					Share with <div style="font-size:8px;">▼</div>
				</li>
				<li role="menuitem" tabindex="0">New Folder</li>
			</MenuBar>
		{/if}
	</div>
	<div class="window-body flex flex-row">
		{@render children()}
	</div>
</div>
