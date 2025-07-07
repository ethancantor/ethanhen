<script lang="ts">
	const BACK_START = [93, 11];
	const BACK_END = [126, 25];
	const FORWARD_START = [158, 11];
	const FORWARD_END = [184, 25];

	const { onBackClick, onForwardClick }: { onBackClick?: () => void; onForwardClick?: () => void } =
		$props();

	function handleClick(event: MouseEvent) {
		const clickX = event.offsetX;
		const clickY = event.offsetY;
		if (
			clickX >= BACK_START[0] &&
			clickX <= BACK_END[0] &&
			clickY >= BACK_START[1] &&
			clickY <= BACK_END[1]
		) {
			if (onBackClick) {
				onBackClick();
			}
		} else if (
			clickX >= FORWARD_START[0] &&
			clickX <= FORWARD_END[0] &&
			clickY >= FORWARD_START[1] &&
			clickY <= FORWARD_END[1]
		) {
			if (onForwardClick) {
				onForwardClick();
			}
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<img src="photo_controls.png" alt="Controls" onclick={handleClick} class="h-10 cursor-pointer" />
