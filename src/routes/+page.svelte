<script>
	import LeftBar from '$lib/components/LeftBar.svelte';
	import MainMenuWindowBody from '$lib/components/MainMenuWindowBody.svelte';
	import MediaPlayer from '$lib/components/MediaPlayer.svelte';
	import Window from '$lib/components/Window.svelte';
</script>

<div class="flex h-full w-full items-center justify-center">
	<Window className="relative translate-y-[-50%]">
		<LeftBar />
		<MainMenuWindowBody />
		<div class="absolute right-0 bottom-0 -z-10 h-fit w-fit translate-x-[75%] translate-y-[90%]">
			<MediaPlayer />
		</div>
	</Window>
</div>
