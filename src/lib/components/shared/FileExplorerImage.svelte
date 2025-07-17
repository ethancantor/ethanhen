<script lang="ts">
	const { onClick, src, name }: { onClick?: (name: string) => void; src?: string; name?: string } =
		$props();

	const NUMBER_OF_CHARACTERS_TO_SHOW = 10;
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="h-fit w-fit cursor-pointer items-center p-2"
	tabindex="0"
	onclick={() => onClick?.(name || 'File')}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onClick?.(name || 'File');
		}
	}}
>
	<img
		src={src || '/windowsIcons/Standard Folders/imageres_3.ico'}
		alt={name}
		class="h-20 w-20 shrink-0 md:h-32 md:w-32"
		loading="lazy"
	/>
	{#if name}
		<div class="max-w-[10rem] text-center text-sm break-all text-black">
			<!-- {#if name.includes('.')}
				{name.split('.').slice(0, -1).join('').slice(0, NUMBER_OF_CHARACTERS_TO_SHOW) +
					'.' +
					name.split('.').pop()}
			{:else}
				{name}
			{/if} -->
			{name}
		</div>
	{/if}
</div>

<style>
</style>
