<script lang="ts">
	import { MenuBar, TopBar } from '$lib';
	import type { Snippet } from 'svelte';
	import MenuBarItem from './MenuBarItem.svelte';

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
		bodyDirection = 'row'
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
	} = $props();
</script>

<div class="window {active ? 'active' : ''} h-fit w-full max-w-[1000px] {className}" {style}>
	<div class="title-bar flex flex-col items-start justify-start">
		<div class="flex w-full flex-row items-start justify-between gap-1">
			{#if titleIcon}
				<img src={titleIcon} alt="Title Icon" class="my-auto h-3 w-3" />
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
