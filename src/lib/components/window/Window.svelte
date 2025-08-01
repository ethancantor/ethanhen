<script lang="ts">
	import { goto } from '$app/navigation';
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
		id,
		title
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
		title?: string;
	} = $props();

	const homeRedirect = () => {
		goto('/');
	};
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
				<img src={titleIcon} alt="Title Icon" class="my-auto mt-[6px] h-3 w-3" loading="eager" />
			{/if}
			{#if title}
				<span class="mt-1 text-nowrap" style="font-size:10px;">{title}</span>
			{/if}
			<div class="flex w-full flex-row justify-end">
				<div class="title-bar-controls">
					<button aria-label="Minimize" onclick={onMinimizeClick || homeRedirect}></button>
					<button aria-label="Maximize" onclick={onMaximizeClick}></button>
					<button aria-label="Close" onclick={onCloseClick || homeRedirect}></button>
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
