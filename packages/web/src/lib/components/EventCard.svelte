<script lang="ts">
	import { getEventUrl } from '$lib/helpers/url'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import EventTime from './EventTime.svelte'
	import { fitParent } from '$lib/helpers/fitParent'
	import IconCalendar from './icons/IconCalendar.svelte'

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
</script>

<a in:fly|global={{ y: 30, delay: introDelay }} {href} class="event-card" class:hover>
	<img
		src={event.imageUrl}
		alt="Title image for an event called '${event.title}'"
		style:background-color={backgroundColor}
	/>

	<div class="info">
		<div class="event-time-container">
			<IconCalendar />
			<EventTime time={event.eventTime} />
		</div>

		<h4 use:fitParent={{ strategy: 'fontSize' }} class="title">{event.title}</h4>
	</div>
</a>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	$spacing: 10%;

	.event-card {
		@include shadow;

		display: flex;
		flex-direction: column;

		font-size: 1rem;
		height: 100%;
		text-align: center;

		// border-radius: 24px;
		border-radius: var(--border-radius);
		overflow: hidden;

		--shadow-color: rgba(0, 0, 0, 0.1);
		border: 1px solid var(--shadow-color);
		// box-shadow: 4px 4px 1px 2px var(--shadow-color);

		transition: all 100ms ease;

		&:hover,
		&:focus,
		&.hover {
			outline: 2px solid #{color.change($color-accent)};
		}

		img {
			width: 100%;
			height: auto;
			min-height: 50%;

			object-fit: cover;

			margin: 0;
		}
	}

	.title,
	.event-time-container {
		margin: 0;
	}

	.title {
		@include font-serif;
		font-size: 1.35em;
		letter-spacing: 1px;

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

	.info {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		flex-grow: 1;
		margin: $spacing;
	}
</style>
