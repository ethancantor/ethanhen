export type FolderToggleContext = {
	open: () => void;
	close: () => void;
	toggle: () => void;
	isOpen: () => boolean;
};
