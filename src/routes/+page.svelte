<script>
	import { LeftBar, MediaPlayer, MenuItem, Window, WindowBody } from '$lib';
</script>

<Window className="relative">
	<LeftBar />
	<WindowBody title="Documents library" subtitle="3 locations">
		<MenuItem label="gallery" href="/gallery" />
		<MenuItem label="upload" href="/upload" />
		<MenuItem label="awesome stuff" href="/console" />
	</WindowBody>
	<div class="absolute right-0 bottom-0 -z-10 h-fit w-fit translate-x-[75%] translate-y-[90%]">
		<MediaPlayer />
	</div>
</Window>
