<script lang="ts">
	import SiteHeading from './site-heading.svelte'
	import Carousel from './carousel/carousel.svelte'
	import CarouselItem from './carousel/carousel-item.svelte'
	import EventCard from '../event-card.svelte'
	import { isMainPage } from './helpers.svelte'
	import { slide } from 'svelte/transition'
	import type { ContentApi } from '#lib/api/content-api.types.ts'

	interface Props {
		headerImages: ContentApi.Image[]
		highlightedEvents: ContentApi.Event[]
	}

	let { headerImages, highlightedEvents }: Props = $props()
</script>

<!--
	The pitch band only belongs on the landing pages. Subpages carry their own
	`<h1>` (the event or page title), so showing it here would give them two.
-->
{#if isMainPage()}
	<div
		out:slide={{ axis: 'y' }}
		class="flex w-full justify-center contain-content"
		style="background-color: #F5F2ED; background-image: repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.03) 0 1px, transparent 1px 28px);"
	>
		<div class="container mx-auto grid max-w-5xl grid-cols-[1fr_1fr] place-content-center py-20">
			<div class="grid place-content-center">
				<SiteHeading />
			</div>

			<!-- TODO: add upcoming events. mark them with badge. mark past highlights with a badge as well -->

			<div class="-m-20 grid place-content-center p-20 contain-content">
				<Carousel autoplay contentClass="max-w-sm">
					{#each highlightedEvents as event, index (index)}
						<CarouselItem class="w-full">
							<EventCard class="w-auto max-w-[500px]" imageClass="max-h-[200px]!" {event}
							></EventCard>
						</CarouselItem>
					{/each}

					<!--
					The photo frames take the full width of the stack, the same as the
					event cards next to them in the deck, so the two kinds of card read
					as one size. The aspect ratio sits on the image rather than the
					frame — the frame's mount is uneven (wider at the bottom), so an
					aspect ratio on the frame would squash the photo by that much — and
					the height cap keeps a portrait poster from towering over an event
					card, with `object-contain` mounting it inside the frame instead of
					cropping it.
				-->
					{#each headerImages as image, index (index)}
						<CarouselItem class="h-auto w-full bg-white p-3 pb-6 shadow">
							<img
								class="max-h-[300px] w-full object-contain"
								style="aspect-ratio: {image.width / image.height};"
								src={image.url}
								alt=""
								loading="lazy"
							/>
						</CarouselItem>
					{/each}
				</Carousel>
			</div>
		</div>
	</div>
{/if}
