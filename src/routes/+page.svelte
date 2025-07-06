<script>
	import LeftBar from '$lib/components/LeftBar.svelte';
	import MainMenuWindowBody from '$lib/components/MainMenuWindowBody.svelte';
	import MediaPlayer from '$lib/components/MediaPlayer.svelte';
	import Window from '$lib/components/Window.svelte';
</script>

<Window className="relative ">
	<LeftBar />
	<MainMenuWindowBody />
	<div class="absolute right-0 bottom-0 -z-10 h-fit w-fit translate-x-[75%] translate-y-[90%]">
		<MediaPlayer />
	</div>
</Window>
