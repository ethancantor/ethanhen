<script lang="ts">
	import { MenuBar, MenuBarItem, TopBar } from '$lib';
	import type { Snippet } from 'svelte';

	let {
		children,
		hasTopBar = true,
		hasMenuBar = true,
		className = '',
		bodyStyle = '',
		titleIcon = '',
		active = true,
		style = '',
		onMinimizeClick,
		onMaximizeClick,
		onCloseClick,
		CustomMenuBar,
		bodyDirection = 'row',
		onClick,
		id
	}: {
		children?: Snippet;
		hasTopBar?: boolean;
		hasMenuBar?: boolean;
		className?: string;
		bodyStyle?: string;
		titleIcon?: string;
		active?: boolean;
		style?: string;
		onMinimizeClick?: () => void;
		onMaximizeClick?: () => void;
		onCloseClick?: () => void;
		CustomMenuBar?: Snippet;
		bodyDirection?: 'row' | 'column';
		onClick?: (event: MouseEvent) => void;
		id?: string;
	} = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="window {active ? 'active' : ''} h-fit w-full max-w-[1000px] {className}"
	{style}
	onclick={onClick}
	{id}
>
	<div class="title-bar flex flex-col items-start justify-start">
		<div class="flex w-full flex-row items-start justify-between gap-1">
			{#if titleIcon}
				<img src={titleIcon} alt="Title Icon" class="my-auto h-3 w-3" loading="eager" />
			{/if}
			<div class="flex w-full flex-row justify-end">
				<div class="title-bar-controls">
					<button aria-label="Minimize" onclick={onMinimizeClick}></button>
					<button aria-label="Maximize" onclick={onMaximizeClick}></button>
					<button aria-label="Close" onclick={onCloseClick}></button>
				</div>
			</div>
		</div>
		{#if hasTopBar}<TopBar />{/if}
		{#if hasMenuBar}
			{#if CustomMenuBar}
				{@render CustomMenuBar()}
			{:else}
				<MenuBar>
					<MenuBarItem hasArrow>Organize</MenuBarItem>
					<MenuBarItem hasArrow>Share with</MenuBarItem>
					<MenuBarItem>New Folder</MenuBarItem>
				</MenuBar>
			{/if}
		{/if}
	</div>
	<div
		class="window-body flex {bodyDirection === 'row' ? 'flex-row' : 'flex-col'}"
		style={bodyStyle}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
