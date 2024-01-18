<script lang="ts">
	import { PortableText } from '@portabletext/svelte'
	import type { PortableTextBlock } from '@portabletext/types'

	let { event } = $props<{
		event: {
			title: string
			slug: string
			imageUrl: string
			prominentColor: string
			excerpt: PortableTextBlock[]
		}
	}>()
</script>

<a href="/post/{event.slug}" class="event-card">
	<img src={event.imageUrl} alt="" loading="lazy" style:background-color={event.prominentColor} />

	<div class="content">
		<h2>{event.title}</h2>

		<PortableText components={{}} value={event.excerpt} />
	</div>
</a>

<style lang="scss">
	.event-card {
		display: flex;
		flex-direction: column;

		border-radius: 12px;
		overflow: hidden;

		--shadow-color: rgba(0, 0, 0, 0.1);
		border: 1px solid var(--shadow-color);
		box-shadow: 4px 4px 1px 2px var(--shadow-color);
		transition: box-shadow 0.2s ease;

		&:hover,
		&:focus {
			--shadow-color: #ff7700;
		}

		img {
			width: 100%;
			height: auto;
			aspect-ratio: 2 / 1;

			object-fit: cover;

			margin: 0;
		}

		.content {
			padding: 2rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;

			:global(> *) {
				margin: 0;
			}
		}
	}
</style>
