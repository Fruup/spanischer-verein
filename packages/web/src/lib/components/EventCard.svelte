<script lang="ts">
	import { getEventUrl } from '$lib/helpers/url'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import EventTime from './EventTime.svelte'

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
	// $: aspectRatio = event.mainImageMeta.dimensions.width / event.mainImageMeta.dimensions.height

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
	<img src={event.imageUrl} alt="" loading="lazy" style:background-color={backgroundColor} />
	<!-- style:aspect-ratio={aspectRatio} -->

	<div class="content">
		<EventTime time={event.eventTime} />

		<h3>{event.title}</h3>
	</div>
</a>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.event-card {
		display: flex;
		flex-direction: column;

		border-radius: 24px;
		overflow: hidden;

		--shadow-color: rgba(0, 0, 0, 0.1);
		border: 1px solid var(--shadow-color);
		box-shadow: 4px 4px 1px 2px var(--shadow-color);

		transition: all 100ms ease;

		&:hover,
		&:focus,
		&.hover {
			--shadow-color: #{color.change($color-accent, $alpha: 0.75)};
		}

		img {
			width: 100%;
			height: auto;
			// aspect-ratio: 1 / 1;

			object-fit: cover;

			margin: 0;
		}

		.content {
			padding: 2rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;

			text-align: center;

			:global(> *) {
				margin: 0;
			}
		}

		:global(.event-time) {
			font-size: 0.95rem;
		}
	}
</style>
