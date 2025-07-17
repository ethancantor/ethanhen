<script>
	import { LeftBar, MenuBar, MenuBarItem, UploadPage, Window } from '$lib';
	import { showFolder } from '$lib/utils/client/writables';

	function handleNewFolder() {
		showFolder.set(true);
	}
</script>

{#snippet NavBarWithNewFolder()}
	<MenuBar>
		<MenuBarItem hasArrow>Organize</MenuBarItem>
		<MenuBarItem hasArrow>Share with</MenuBarItem>
		<MenuBarItem onClick={handleNewFolder}>New Folder</MenuBarItem>
	</MenuBar>
{/snippet}

<Window CustomMenuBar={NavBarWithNewFolder}>
	<LeftBar />
	<UploadPage />
</Window>
