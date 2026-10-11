<script lang="ts">
	import { cn } from '#lib/utils.js'

	interface Props {
		direction?: 'up' | 'down' | 'left' | 'right'
		transition?: boolean | undefined
	}

	let { direction = 'down', transition = undefined }: Props = $props()

	let rotate = $derived(
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
	fill="currentColor"
	style:rotate
	class={cn(transition && 'transition-[rotate] duration-200 ease-[ease]')}
>
	<path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
</svg>
