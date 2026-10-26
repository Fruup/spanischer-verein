<script lang="ts" module>
	let headerHeight = $state(0)
	export const getHeaderHeight = () => headerHeight
</script>

<script lang="ts">
	import MobileMenu from './mobile-menu.svelte'
	import SiteHeading from './site-heading.svelte'
	import SiteLogo from './site-logo.svelte'
	import SiteMenu from './site-menu.svelte'
	import SocialLinks from './social-links.svelte'
	import ThemeToggle from '../theme-toggle.svelte'
	import type { NavigationItem } from './types'
	import type { SanityImageWithMeta } from '#lib/sanity/types.ts'
	import Carousel from './carousel/carousel.svelte'
	import CarouselItem from './carousel/carousel-item.svelte'
	import EventCard from '../event-card.svelte'
	import { isMainPage } from './helpers.svelte'
	import { slide } from 'svelte/transition'

	interface Props {
		items: NavigationItem[]
		headerImages: SanityImageWithMeta[]
		highlightedEvents: any[] // TODO: type
	}

	let { items: _items, headerImages, highlightedEvents }: Props = $props()

	const items: NavigationItem[] = $derived([
		{
			title: 'Startseite',
			href: '/',
		},
		..._items,
	])

	let headerContainer = $state<HTMLElement>()
	$effect(() => {
		if (!headerContainer) return
		headerHeight = headerContainer.getBoundingClientRect().height
	})
</script>

<header
	bind:this={headerContainer}
	class="sticky top-0 z-10 grid h-20 grid-cols-[1fr_auto_1fr] overflow-visible overflow-x-clip bg-background/70 text-center shadow backdrop-blur-md"
>
	<div class="flex items-center">
		<div class="grid aspect-square h-full w-auto place-content-center">
			<SiteLogo height="3rem" />
		</div>

		<span class="text-sm font-semibold">Centro Machado</span>
	</div>

	<div class="flex items-center">
		<div id="scroll-to-marker" class="invisible h-0"></div>
		<SiteMenu {items} />
		<SocialLinks />
	</div>

	<div class="grid place-content-center">
		<ThemeToggle />
	</div>
</header>

<!--
	The pitch band only belongs on the landing pages. Subpages carry their own
	`<h1>` (the event or page title), so showing it here would give them two.
-->
{#if isMainPage()}
	<div out:slide={{ axis: 'y' }} class="flex w-full justify-center bg-[#F5F2ED] py-20">
		<div
			class="container mx-auto grid max-w-5xl grid-cols-[1fr_1fr] place-content-center items-center justify-center gap-10"
		>
			<SiteHeading />

			<!-- TODO: add upcoming events. mark them with badge -->

			<Carousel autoplay contentClass="max-w-sm">
				{#each highlightedEvents as event, index (index)}
					<CarouselItem class="w-full">
						<!-- <EventCard class="w-full" horizontal {event}></EventCard> -->
						<EventCard class="w-auto max-w-[500px]" imageClass="max-h-[200px]!" {event}></EventCard>
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
{/if}

<MobileMenu {items} />
