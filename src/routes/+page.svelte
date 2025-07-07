<script>
	import { LeftBar, MainMenuWindowBody, MediaPlayer, Window } from '$lib';
</script>

<Window className="relative ">
	<LeftBar />
	<MainMenuWindowBody />
	<div class="absolute right-0 bottom-0 -z-10 h-fit w-fit translate-x-[75%] translate-y-[90%]">
		<MediaPlayer />
	</div>
</Window>
