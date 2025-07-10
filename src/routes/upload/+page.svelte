<script>
	import { LeftBar, MenuBar, MenuBarItem, UploadPage, Window } from '$lib';
	import { setFolderToggleContext } from '$lib/utils/client/context';

	function handleNewFolder() {
		createFolderToggle = !createFolderToggle;
		console.log('New Folder Clicked', createFolderToggle);
	}

	let createFolderToggle = $state(false);

	setFolderToggleContext({
		open: () => {
			createFolderToggle = true;
		},
		close: () => {
			createFolderToggle = false;
		},
		toggle: () => {
			createFolderToggle = !createFolderToggle;
		},
		isOpen: () => createFolderToggle
	});
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
