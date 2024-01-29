<script lang="ts">
	import { getEventUrl } from '$lib/helpers/url'
	import { fly } from 'svelte/transition'

	let { event, introDelay } = $props<{
		event: {
			title: string
			slug: string
			imageUrl: string
			eventTime: Date
			mainImageMeta: {
				prominentColor: string
				dimensions: {
					width: number
					height: number
				}
			}
		}
		introDelay?: number
	}>()

	const backgroundColor = $derived(event.mainImageMeta.prominentColor)

	const aspectRatio = $derived(
		event.mainImageMeta.dimensions.width / event.mainImageMeta.dimensions.height,
	)

	const eventTime = $derived(
		new Date(event.eventTime).toLocaleString(undefined, {
			dateStyle: 'medium',
			timeStyle: 'medium',
		}),
	)
</script>

<a
	in:fly|global={{ y: 30, delay: introDelay }}
	href={getEventUrl(event.slug)}
	class="event-card"
	data-sveltekit-noscroll
>
	<img
		src={event.imageUrl}
		alt=""
		loading="lazy"
		style:background-color={backgroundColor}
		style:aspect-ratio={aspectRatio}
	/>

	<div class="content">
		<time>{eventTime}</time>

		<h2>{event.title}</h2>
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

		transition: box-shadow 100ms ease;

		&:hover,
		&:focus {
			--shadow-color: #{color.change($color-accent, $alpha: 0.75)};

			box-shadow: 6px 6px 1px 4px var(--shadow-color);
		}

		img {
			width: 100%;
			height: auto;
			aspect-ratio: 1 / 1;
			// aspect-ratio: 2 / 1;

			object-fit: cover;

			margin: 0;
		}

		time {
			font-size: 0.99rem;
			color: #666;
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
	}
</style>
