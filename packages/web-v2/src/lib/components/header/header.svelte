<script lang="ts">
	import { fly } from 'svelte/transition'

	import { duration, motion } from '#lib/helpers/motion.js'

	import MobileMenu from './mobile-menu.svelte'
	import SiteHeading from './site-heading.svelte'
	import SiteLogo from './site-logo.svelte'
	import SiteMenu from './site-menu.svelte'
	import SocialLinks from './social-links.svelte'
	import ThemeToggle from '../theme-toggle.svelte'
	import type { NavigationItem } from './types'

	interface Props {
		items: NavigationItem[]
		leftImageUrl?: string | undefined
		rightImageUrl?: string | undefined
	}

	let { items: _items, leftImageUrl = undefined, rightImageUrl = undefined }: Props = $props()

	const homeItem: NavigationItem = {
		title: 'Home',
		href: '/',
	}

	let items = $derived([homeItem, ..._items])

	const transition = {
		x: 100,
		duration: motion(duration.ambient),
		opacity: 0,
	}

	const imageClasses =
		'absolute inset-0 left-auto -z-[1000] h-full max-w-[var(--max-width)] [--max-width:33%] max-desktop:[--max-width:20%] [&>img]:size-full [&>img]:object-cover'
</script>

<header
	class="relative max-h-[100svh] overflow-visible overflow-x-clip p-8 pb-16 text-center [&_.social-links]:absolute [&_.social-links]:right-[var(--gap)] [&_.social-links]:bottom-[var(--gap)] [&_.social-links]:[--gap:2rem] max-desktop:[&_.social-links]:[--gap:1rem]"
>
	<SiteLogo />
	<div id="scroll-to-marker" class="invisible h-0"></div>
	<SiteHeading />
	<SiteMenu {items} />
	<SocialLinks />

	<div class="absolute top-6 right-6 z-10 max-desktop:top-4 max-desktop:right-4">
		<ThemeToggle />
	</div>

	{#if leftImageUrl}
		{#each [leftImageUrl] as url (url)}
			<div
				in:fly={{
					x: -transition.x,
					duration: transition.duration,
					delay: transition.duration / 2,
					opacity: transition.opacity,
				}}
				out:fly={{
					duration: transition.duration,
					delay: 0,
					opacity: transition.opacity,
				}}
				class="{imageClasses} right-auto left-0 after:absolute after:inset-0 after:z-[1000] after:content-[''] after:[background:linear-gradient(to_left,var(--header-fade),transparent_75%)] max-desktop:hidden"
			>
				<img src={url} alt="" />
			</div>
		{/each}
	{/if}

	<!-- {#if rightImageUrl}
		{@const delayOffset = transition.duration / 4}

		{#each [rightImageUrl] as url (url)}
			<div
				in:fly={{
					x: transition.x,
					duration: transition.duration,
					delay: transition.duration / 2 + delayOffset,
					opacity: transition.opacity,
				}}
				out:fly={{
					duration: transition.duration,
					delay: delayOffset,
					opacity: transition.opacity,
				}}
				class="{imageClasses} after:absolute after:inset-0 after:z-[1000] after:content-[''] after:[background:linear-gradient(to_right,var(--header-fade),transparent_75%)] max-desktop:w-full max-desktop:[mask-image:linear-gradient(to_bottom,white,transparent_80%)] max-desktop:[--max-width:100%] max-desktop:after:hidden"
			>
				<img src={url} alt="" />
			</div>
		{/each}
	{/if} -->
</header>

<MobileMenu {items} />
