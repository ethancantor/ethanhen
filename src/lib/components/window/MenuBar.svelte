<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children, hasIcons = true }: { children?: Snippet; hasIcons?: boolean } = $props();
</script>

<ul role="menubar" class="relative flex w-full">
	{#if children}
		{@render children()}
	{/if}
	{#if hasIcons}
		<div
			class="absolute top-0 right-0 me-2 flex translate-y-[50%] flex-row items-center gap-1 overflow-hidden md:gap-5"
		>
			<div class="me-1 flex flex-row items-center gap-1 md:me-3 md:gap-2">
				<img src="/windowsIcons/TopBar/picture.ico" alt="icon" class="h-4 w-4" />
				<span style="font-size:8px" class="rotate-90">▶</span>
			</div>
			<img src="/windowsIcons/TopBar/boxes.ico" alt="icon" class="h-3 w-4" />
			<img src="/windowsIcons/TopBar/question.ico" alt="icon" class="h-4 w-4" />
		</div>
	{/if}
</ul>
