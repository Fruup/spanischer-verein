<script lang="ts">
	import Header from '../../lib/components/header/Header.svelte'
	import EventCalendar from '$lib/components/eventCalendar/EventCalendar.svelte'
	import Divider from './Divider.svelte'
	import { getEventUrl } from '$lib/helpers/url'
	import ParticipateSection from './ParticipateSection.svelte'
	import { navigating } from '$app/stores'
	import Loader from '$lib/components/icons/Loader.svelte'
	import { fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import Footer from './Footer.svelte'
	import MobileCalendar, { isMobileCalendarOpen } from './MobileCalendar.svelte'
	import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation'
	import type { RouteId as ContentPageRouteId } from './[...pageUrl]/$types'
	import type { RouteId as EventPageRouteId } from './event/[slug]/$types'
	import type { RouteId as HomeRouteId } from './$types'
	import { pick } from '$lib/helpers/pick'
	import { Toaster } from 'svelte-french-toast'
	import MobileNavigationBar from '$lib/components/navigation/MobileNavigationBar.svelte'
	import { isMobileMenuOpen } from '$lib/components/header/MobileMenu.svelte'

	export let data

	$: siteSettings = data.siteSettings

	$: events = data.events.map((e) => ({
		name: e.title,
		url: getEventUrl(e.slug),
		date: new Date(e.eventTime),
	}))

	$: headerImages = data.siteSettings?.headerImageUrls ?? []
	$: mail = data.siteSettings?.contactEmail ?? 'info@spanischer-verein.com'
	$: imprintPageSlug = siteSettings?.imprintPageSlug
	$: privacyUrl = siteSettings?.privacyPageSlug && `/${siteSettings.privacyPageSlug}`

	/**
	 * Rotate header images on page navigation.
	 */

	let imageIndexLeft = data.leftHeaderImageIndex
	let imageIndexRight = data.rightHeaderImageIndex

	$: leftImageUrl = headerImages.at(imageIndexLeft)
	$: rightImageUrl = headerImages.at(imageIndexRight)

	const changeImageOn: (ContentPageRouteId | HomeRouteId | EventPageRouteId)[] = [
		'/(root)',
		'/(root)/[...pageUrl]',
		'/(root)/event/[slug]',
	]

	beforeNavigate(({ from, to }) => {
		if (from?.url.toString() === to?.url.toString()) return

		// @ts-ignore
		if (!changeImageOn.includes(to?.route?.id)) return

		const exclude = [imageIndexLeft, imageIndexRight]
		imageIndexLeft = pick(headerImages, exclude)?.index ?? imageIndexLeft
		exclude.push(imageIndexLeft)
		imageIndexRight = pick(headerImages, exclude)?.index ?? imageIndexRight
	})

	afterNavigate(({ type, to }) => {
		if (!(['goto', 'link'] as (typeof type)[]).includes(type)) return

		// Do not scroll to top when navigating using the calendar.
		if (to?.url.pathname.startsWith('/archiv')) return

		const logo = document.querySelector('#scroll-to-marker')
		logo?.scrollIntoView({ behavior: 'smooth' })
	})
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>

	{#if data.siteSettings?.logoUrl}
		<link rel="icon" href={data.siteSettings.logoUrl} />
	{/if}
</svelte:head>

<Toaster />

<!-- <SkipNavigation /> -->

<Header items={data.navigationTree} {leftImageUrl} {rightImageUrl} />
<MobileNavigationBar
	bind:isCalendarOpen={$isMobileCalendarOpen}
	bind:isFlyoutOpen={$isMobileMenuOpen}
/>

<Divider />

<div class="content">
	<main>
		{#if $navigating}
			<div style="min-height: 50vh; display: grid; place-content: center">
				<Loader />
			</div>
		{:else}
			<slot />
		{/if}
	</main>

	<div class="divider" />

	<aside>
		<div class="aside-content">
			<h3 id="calendar" class="heading-3">Kalender</h3>

			<p class="calendar-tutorial">
				💡 Navigiere im Kalender, um vergangene Veranstaltungen zu durchstöbern.
			</p>

			<EventCalendar {events} />
			<MobileCalendar {events} />

			<h3 class="heading-2">Mitmachen</h3>

			<ParticipateSection {mail} {privacyUrl} />

			<!-- <PageSearch /> -->
		</div>
	</aside>
</div>

{#if $navigating}
	<div class="navigation-indicator" transition:fly={{ x: -20, duration: 500, easing: cubicOut }}>
		<Loader />
	</div>
{/if}

<div style="scale: 1 -1">
	<Divider />
</div>

<Footer imprintUrl={imprintPageSlug && `/${imprintPageSlug}`} {privacyUrl} />

<!-- 
	* Analytics
	! Keep this at the bottom
-->
<svelte:element
	this="script"
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

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.content {
		display: grid;
		// grid-template-columns: auto auto 375px;
		grid-template-columns: 1fr min-content min-content;

		max-width: 1200px;

		margin: 0 auto;
		padding: 0 2.5rem;
		gap: 2.5rem;
		box-sizing: content-box;

		@include max-md {
			grid-template-columns: 1fr;

			main {
				margin-bottom: 0;
			}
		}

		@include max-sm {
			padding: 0 1rem;
		}
	}

	.aside-content {
		position: sticky;
		top: 2rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		.heading-2 {
			margin-bottom: 0;
		}

		@include max-md {
			align-items: center;
			max-width: 500px;
			margin: auto;

			:global {
				.calendar,
				.calendar-tutorial,
				#calendar {
					display: none;
				}
			}
		}
	}

	.divider {
		width: 2px;
		height: 100%;
		background: rgba(0, 0, 0, 0.05);

		@include max-md {
			width: auto;
			height: 2px;
		}
	}

	main,
	aside {
		margin-top: 2.5rem;
		margin-bottom: 4rem;

		:global(h3:first-of-type) {
			margin-top: 0;
		}
	}

	.navigation-indicator {
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 1000;
	}

	#calendar {
		margin-bottom: 0;
	}

	.calendar-tutorial {
		font-size: 0.85rem;
		color: var(--color-text-1);
		margin: 0;
	}
</style>
