<script lang="ts">
	let { direction = 'down', transition } = $props<{
		direction?: 'up' | 'down' | 'left' | 'right'
		transition?: boolean
	}>()

	const rotate = $derived(
		{
			down: '0deg',
			up: '180deg',
			right: '-90deg',
			left: '90deg',
		}[direction],
	)
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	height="1lh"
	viewBox="0 -960 960 960"
	stroke="currentColor"
	style:rotate
	class:transition
>
	<path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
</svg>

<style>
	svg.transition {
		transition: rotate 200ms ease;
	}
</style>
