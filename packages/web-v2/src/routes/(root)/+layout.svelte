<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation'
	import { navigating, page } from '$app/state'
	import { cubicOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'

	import EventCalendar from '#lib/components/event-calendar/event-calendar.svelte'
	import Header from '#lib/components/header/header.svelte'
	import { mobileMenu } from '#lib/components/header/mobile-menu.svelte'
	import Loader from '#lib/components/icons/loader.svelte'
	import MobileNavigationBar from '#lib/components/navigation/mobile-navigation-bar.svelte'
	import { Toaster } from '#lib/components/ui/sonner/index.js'
	import { duration, motion } from '#lib/helpers/motion.js'
	import { pick } from '#lib/helpers/pick.js'
	import { getEventUrl, parseMonthFromUrl } from '#lib/helpers/url.js'
	import {
		getEventsOverview,
		getHeaderImageIndices,
		getNavigationTree,
		getSiteSettings,
	} from '#lib/sanity/sanity.remote.js'
	import { locale } from '#lib/services/locale.svelte.js'

	import Divider from './divider.svelte'
	import Footer from './footer.svelte'
	import MobileCalendar, { mobileCalendar } from './mobile-calendar.svelte'
	import ParticipateSection from './participate-section.svelte'
	import type { LayoutProps } from './$types'

	let { children }: LayoutProps = $props()

	const siteSettings = await getSiteSettings()
	const navigationTree = await getNavigationTree()
	const headerImageIndices = await getHeaderImageIndices()

	// The calendar follows the month in the URL, so the archive routes can drive it.
	let events = $derived(await getEventsOverview(parseMonthFromUrl(page.params)))

	let calendarEvents = $derived(
		events.map((event) => ({
			name: event.title,
			url: getEventUrl(event.slug),
			date: new Date(event.eventTime),
		})),
	)

	let headerImages = $derived(siteSettings?.headerImageUrls ?? [])
	let mail = $derived(siteSettings?.contactEmail ?? 'info@spanischer-verein.com')
	let imprintUrl = $derived(siteSettings?.imprintPageSlug && `/${siteSettings.imprintPageSlug}`)
	let privacyUrl = $derived(siteSettings?.privacyPageSlug && `/${siteSettings.privacyPageSlug}`)

	/**
	 * Rotate header images on page navigation.
	 */

	let imageIndexLeft = $state(headerImageIndices.left)
	let imageIndexRight = $state(headerImageIndices.right)

	let leftImageUrl = $derived(headerImages.at(imageIndexLeft))
	let rightImageUrl = $derived(headerImages.at(imageIndexRight))

	const changeImageOn = ['/(root)', '/(root)/[...pageUrl]', '/(root)/event/[slug]']

	beforeNavigate(({ from, to }) => {
		if (from?.url.toString() === to?.url.toString()) return
		if (!to?.route?.id || !changeImageOn.includes(to.route.id)) return

		const exclude = [imageIndexLeft, imageIndexRight]
		imageIndexLeft = pick(headerImages, exclude)?.index ?? imageIndexLeft
		exclude.push(imageIndexLeft)
		imageIndexRight = pick(headerImages, exclude)?.index ?? imageIndexRight
	})

	afterNavigate(({ type, to }) => {
		if (!(['goto', 'link'] as (typeof type)[]).includes(type)) return

		// Do not scroll to top when navigating using the calendar.
		if (to?.url.pathname.startsWith('/archiv')) return

		const marker = document.querySelector('#scroll-to-marker')
		marker?.scrollIntoView({ behavior: 'smooth' })
	})

	$effect(() => {
		locale.set(navigator.language)
	})
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>

	{#if siteSettings?.logoUrl}
		<link rel="icon" href={siteSettings.logoUrl} />
	{/if}
</svelte:head>

<Toaster position="bottom-center" />

<Header items={navigationTree} {leftImageUrl} {rightImageUrl} />
<MobileNavigationBar
	bind:isCalendarOpen={mobileCalendar.open}
	bind:isFlyoutOpen={mobileMenu.open}
/>

<Divider />

<div
	class="mx-auto box-content grid max-w-[1200px] [grid-template-columns:1fr_min-content_min-content] gap-10 px-10 max-desktop:grid-cols-1 max-tablet:px-4"
>
	<main class="mt-10 mb-16 max-desktop:mb-0 [&_h3:first-of-type]:mt-0">
		{#if navigating.to}
			<div class="grid min-h-[50vh] place-content-center">
				<Loader />
			</div>
		{:else}
			{@render children?.()}
		{/if}
	</main>

	<div class="h-full w-[2px] bg-hairline max-desktop:h-[2px] max-desktop:w-auto"></div>

	<aside class="mt-10 mb-16 [&_h3:first-of-type]:mt-0">
		<div
			class="sticky top-8 flex flex-col gap-4 max-desktop:mx-auto max-desktop:max-w-[500px] max-desktop:items-center"
		>
			<!-- The desktop calendar; on narrow screens it moves into a drawer. -->
			<div class="contents max-desktop:hidden">
				<h3 id="calendar" class="heading-3 mb-0">Kalender</h3>

				<p class="m-0 text-xs text-ink-muted">
					💡 Navigiere im Kalender, um vergangene Veranstaltungen zu durchstöbern.
				</p>

				<EventCalendar events={calendarEvents} />
			</div>

			<MobileCalendar events={calendarEvents} />

			<h3 class="heading-2 mb-0">Mitmachen</h3>

			<ParticipateSection {mail} {privacyUrl} donationLink={siteSettings?.donationLink} />
		</div>
	</aside>
</div>

{#if navigating.to}
	<div
		class="fixed top-4 left-4 z-[1000]"
		transition:fly={{ x: -20, duration: motion(duration.slow), easing: cubicOut }}
	>
		<Loader />
	</div>
{/if}

<div style="scale: 1 -1">
	<Divider />
</div>

<Footer {imprintUrl} {privacyUrl} />

<!--
	* Analytics
	! Keep this at the bottom
-->
<svelte:element
	this={"script"}
	async
	defer
	src="https://scripts.simpleanalyticscdn.com/latest.{import.meta.env.PROD ? '' : 'dev.'}js"
></svelte:element>
{#if import.meta.env.PROD}
	<noscript>
		<img
			src="https://queue.simpleanalyticscdn.com/noscript.gif"
			alt=""
			referrerpolicy="no-referrer-when-downgrade"
		/>
	</noscript>
{/if}
