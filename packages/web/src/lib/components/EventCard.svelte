<script lang="ts">
	import { getEventUrl } from '$lib/helpers/url'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import EventTime from './EventTime.svelte'
	import IconTime from './icons/IconTime.svelte'
	import type { Action } from 'svelte/action'

	export let event: {
		title: string
		slug: string
		imageUrl: string
		eventTime: string
		mainImageMeta: {
			prominentColor: string
			dimensions: {
				width: number
				height: number
			}
		}
	}

	export let introDelay: number

	$: backgroundColor = event.mainImageMeta.prominentColor

	const href = getEventUrl(event.slug)
	let hover = false

	onMount(() => {
		const as = document.querySelectorAll<HTMLAnchorElement>(`a[href="${href}"]`)

		const setHoverValueTrue = () => (hover = true)
		const setHoverValueFalse = () => (hover = false)

		as.forEach((a) => {
			a.addEventListener('focus', setHoverValueTrue)
			a.addEventListener('blur', setHoverValueFalse)

			a.addEventListener('mouseover', setHoverValueTrue)
			a.addEventListener('mouseleave', setHoverValueFalse)
		})

		return () => {
			as.forEach((a) => {
				a.removeEventListener('focus', setHoverValueTrue)
				a.removeEventListener('blur', setHoverValueFalse)

				a.removeEventListener('mouseover', setHoverValueTrue)
				a.removeEventListener('mouseleave', setHoverValueFalse)
			})
		}
	})

	const fitParent: Action<HTMLElement, { strategy?: 'fontSize' | 'boxSize' | 'scale' }> = (
		node,
		options,
	) => {
		const parent = node.parentElement
		if (!parent) return

		const { strategy = 'scale' } = options

		const sx = parent.clientWidth / node.clientWidth
		const sy = parent.clientHeight / node.clientHeight
		const scale = Math.min(sx, sy)

		if (scale >= 1) return

		if (strategy === 'scale') {
			node.style.scale = scale.toString()
		} else if (strategy === 'boxSize') {
			node.style.width = `${scale * node.clientWidth}px`
			node.style.height = `${scale * node.clientHeight}px`
		} else if (strategy === 'fontSize') {
			const fontSize = Number(getComputedStyle(node).fontSize.slice(0, -2))

			node.style.fontSize = `${fontSize * scale}px`
		}

		// TODO: observe resize
	}
</script>

<a in:fly|global={{ y: 30, delay: introDelay }} {href} class="event-card" class:hover>
	<img
		src={event.imageUrl}
		alt="Title image for an event called '${event.title}'"
		style:background-color={backgroundColor}
	/>

	<div class="event-time-container">
		<IconTime size={0.7} />
		<EventTime time={event.eventTime} />
	</div>

	<h4 use:fitParent={{ strategy: 'fontSize' }} class="title">{event.title}</h4>
</a>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.event-card {
		font-size: 1rem;
		display: block;
		height: 100%;
		text-align: center;

		border-radius: 24px;
		overflow: hidden;

		--shadow-color: rgba(0, 0, 0, 0.1);
		border: 1px solid var(--shadow-color);
		box-shadow: 4px 4px 1px 2px var(--shadow-color);

		transition: all 100ms ease;

		&:hover,
		&:focus,
		&.hover {
			outline: 2px solid #{color.change($color-accent)};
		}

		img {
			width: 100%;
			height: auto;

			object-fit: cover;

			margin: 0;
		}
	}

	.title,
	.event-time-container {
		margin: 1rem;
	}

	.title {
		@include font-serif;
		font-size: 1.35em;
		letter-spacing: 1px;

		margin-left: 0;
		margin-right: 0;
		padding: 0 1rem;

		width: fit-content;
	}

	.event-time-container {
		font-size: 0.8em;
		letter-spacing: 1px;

		display: flex;
		align-items: center;
		gap: 1ch;
		justify-content: center;

		padding: 0.15em 0.5em;
		background: color.adjust($color-accent, $lightness: -5%, $alpha: -0.2);
		border-radius: 999px;

		:global(*) {
			color: white;
		}
	}
</style>
