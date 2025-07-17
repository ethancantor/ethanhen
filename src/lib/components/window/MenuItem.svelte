<script lang="ts">
	const { label, href }: { label: string; href: string } = $props();
</script>

<a {href} class="flex w-fit shrink-0 flex-col items-center rounded-lg p-2">
	<img
		src={'/windowsIcons/Standard Folders/imageres_3.ico'}
		alt={label}
		class="h-20 w-20 shrink-0 md:h-32 md:w-32"
		id={label}
	/>
	<label class="w-full text-center text-xs text-black" for={label}>
		{label}
	</label>
</a>
