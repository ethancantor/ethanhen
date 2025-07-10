<script lang="ts">
	import type { Snippet } from 'svelte';
	const {
		title,
		subtitle,
		className = '',
		children
	}: {
		title?: string;
		subtitle?: string | Snippet;
		children?: Snippet;
		className?: string;
	} = $props();
</script>

<div class="flex h-full w-full flex-col p-2">
	<div class="flex h-fit w-full flex-row items-start justify-between border-b-1 border-gray-300">
		<div class="mb-2 flex flex-col">
			<span class="text-lg font-light text-[#077148]"> {title} </span>
			{#if subtitle && typeof subtitle === 'string'}
				<span>Includes: <span class="text-[#1672cc]"> {subtitle}</span> </span>
			{/if}
			{#if subtitle && typeof subtitle !== 'string'}
				{@render subtitle()}
			{/if}
		</div>
		<div class="flex h-10 flex-row items-center gap-2">
			<span>Arrange by:</span>
			<span class="text-[#1672cc]"> Folder </span>
			<span style="font-size:8px">▼</span>
		</div>
	</div>
	<div class="flex flex-row gap-8 {className}">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
