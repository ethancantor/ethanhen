<script lang="ts">
	const { onClick, src, name }: { onClick?: (name: string) => void; src?: string; name?: string } =
		$props();

	const NUMBER_OF_CHARACTERS_TO_SHOW = 10;
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="flex h-fit w-fit cursor-pointer flex-col items-center"
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
		class="h-12"
		loading="lazy"
	/>
	{#if name}
		<div class="max-w-[10rem] text-center text-sm break-all text-black">
			{#if name.includes('.')}
				{name.split('.').slice(0, -1).join('').slice(0, NUMBER_OF_CHARACTERS_TO_SHOW) +
					'.' +
					name.split('.').pop()}
			{:else}
				{name}
			{/if}
		</div>
	{/if}
</div>

<style>
</style>
