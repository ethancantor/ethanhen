<script lang="ts">
	export let label: string;
	export let href: string;
</script>

<a {href} class="flex w-fit flex-col items-center rounded-lg p-2">
	<img
		src={'/windowsIcons/Standard Folders/imageres_3.ico'}
		alt={label}
		class="h-32 w-32"
		id={label}
	/>
	<label class="w-full text-center text-xs text-black" for={label}>
		{label}
	</label>
</a>
