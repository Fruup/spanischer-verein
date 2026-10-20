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
</script>

<header
	class="sticky top-0 z-10 grid h-20 grid-cols-[1fr_auto_1fr] overflow-visible overflow-x-clip bg-background text-center shadow"
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

<div class="flex w-full justify-center bg-[#F5F2ED] py-20">
	<div
		class="container mx-auto grid grid-cols-[1fr_1fr] place-content-center items-center justify-center gap-10"
	>
		<SiteHeading />

		{#if isMainPage()}
			<!-- TODO: add upcoming events. mark them with badge -->

			<Carousel autoplay class="p-2 contain-content">
				{#each highlightedEvents as event, index (index)}
					<CarouselItem class="size-fit">
						<EventCard class="w-auto" horizontal {event}></EventCard>
					</CarouselItem>
				{/each}

				{#each headerImages as image, index (index)}
					<CarouselItem
						class="h-auto"
						style="
    					    background-color: {image.prominentColor};
    						width: min(300px, {image.width}px);
    						max-height: {image.height}px;
    						aspect-ratio: {image.width / image.height};
    					"
					>
						<img class="size-full" src={image.url} alt="" loading="lazy" />
					</CarouselItem>
				{/each}
			</Carousel>
		{/if}
	</div>
</div>

<MobileMenu {items} />
