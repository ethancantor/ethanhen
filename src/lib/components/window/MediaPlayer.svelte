<script>
	import { Window } from '$lib';
</script>

<Window
	hasTopBar={false}
	hasMenuBar={false}
	titleIcon="/windowsIcons/Windows Media Player/player.ico"
	active={false}
>
	<div class="relative h-fit w-64 bg-gradient-to-b from-black via-[#152b6b] to-black px-1 pt-8">
		<span class="absolute top-1 text-white" style="font-size:9px;">Kalimba</span>
		<img
			src="/media_top_button.png"
			alt="Media Player Icon"
			class="absolute top-1 right-2 h-4 w-4"
		/>
		<img src="/mrscruff.jpg" alt="Media Player" class="mx-auto w-[80%]" />
		<div class="mt-2 h-1 w-full rounded-full outline outline-gray-500"></div>
		<img src="/media_controls.png" alt="Media Controls" class="ms-7 w-[90%]" />
	</div>
</Window>
