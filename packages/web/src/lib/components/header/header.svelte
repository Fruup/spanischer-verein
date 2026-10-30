<script lang="ts" module>
	let headerHeight = $state(0)
	export const getHeaderHeight = () => headerHeight
</script>

<script lang="ts">
	import MobileMenu from './mobile-menu.svelte'
	import SiteHeading from './site-heading.svelte'
	import SiteLogo from './site-logo.svelte'
	import HeaderNav from './header-nav.svelte'
	import SocialLinks from './social-links.svelte'
	import ThemeToggle from '../theme-toggle.svelte'
	import type { NavigationItem } from './types'
	import type { SanityImageWithMeta } from '#lib/sanity/types.ts'
	import Carousel from './carousel/carousel.svelte'
	import CarouselItem from './carousel/carousel-item.svelte'
	import EventCard from '../event-card.svelte'
	import { isMainPage } from './helpers.svelte'
	import { slide } from 'svelte/transition'
	import LocaleSelector from '#lib/locale/locale-selector.svelte'

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

	<HeaderNav {items} />

	<div class="flex items-center gap-4 justify-self-end pr-8">
		<SocialLinks />
		<LocaleSelector />
	</div>
</header>

<!--
	The pitch band only belongs on the landing pages. Subpages carry their own
	`<h1>` (the event or page title), so showing it here would give them two.
-->
{#if isMainPage()}
	<div out:slide={{ axis: 'y' }} class="flex w-full justify-center bg-[#F5F2ED] contain-content">
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

<MobileMenu {items} />
