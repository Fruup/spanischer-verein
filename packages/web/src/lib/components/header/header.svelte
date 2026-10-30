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

<PitchBand {headerImages} {highlightedEvents} />

<MobileMenu {items} />
