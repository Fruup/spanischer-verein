<script lang="ts" module>
	let headerHeight = $state(0)
	export const getHeaderHeight = () => headerHeight
</script>

<script lang="ts">
	import MobileMenu from './mobile-menu.svelte'
	import PitchBand from './pitch-band.svelte'
	import SiteLogo from './site-logo.svelte'
	import HeaderNav from './header-nav.svelte'
	import SocialLinks from './social-links.svelte'
	import type { ContentApi } from '#lib/api/content-api.types.ts'
	import LocaleSelector from '#lib/locale/locale-selector.svelte'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		items: ContentApi.NavigationItem[]
		headerImages: ContentApi.Image[]
		highlightedEvents: ContentApi.Event[]
	}

	let { items: _items, headerImages, highlightedEvents }: Props = $props()

	const items: ContentApi.NavigationItem[] = $derived([
		{
			_key: 'home',
			title: t('nav_home'),
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
	class="sticky top-0 z-10 grid h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] overflow-visible overflow-x-clip bg-background/70 text-center shadow backdrop-blur-md [--header-logo:3rem] max-tablet:h-14 max-tablet:[--header-logo:2rem]"
>
	<div class="flex items-center">
		<!--
			A square the size of the header bar, written out as a width rather than
			as `aspect-square` on an auto width: with `aspect-ratio` the box takes
			its width from the logo and derives its height from that, so a logo
			wider than it is tall makes the box taller than the bar it sits in and
			the whole row spills out below the header.
		-->
		<div class="grid h-full w-20 shrink-0 place-content-center max-tablet:w-14">
			<SiteLogo height="var(--header-logo)" />
		</div>

		<span class="text-sm font-semibold text-nowrap">Centro Machado</span>
	</div>

	<HeaderNav {items} />

	<!--
		Pinned to the last column by name. Below desktop the nav in the middle
		column is `display: none`, which takes it out of the grid flow entirely —
		without this the social links and the locale selector slide up into the
		middle and sit against the site name instead of the right edge.
	-->
	<div
		class="col-start-3 flex items-center gap-4 justify-self-end pr-8 max-tablet:gap-2 max-tablet:pr-4"
	>
		<div class="max-tablet:hidden">
			<SocialLinks />
		</div>
		<LocaleSelector />
	</div>
</header>

<PitchBand {headerImages} {highlightedEvents} />

<MobileMenu {items} />
