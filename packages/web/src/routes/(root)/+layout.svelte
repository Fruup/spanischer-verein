<script lang="ts">
	import Header from '../../lib/components/header/Header.svelte'
	import EventCalendar from '$lib/components/eventCalendar/EventCalendar.svelte'
	import SkipNavigation from '$lib/components/SkipNavigation.svelte'
	import Divider from './Divider.svelte'
	import { getEventUrl } from '$lib/helpers/url'
	import ParticipateSection from './ParticipateSection.svelte'
	import { navigating } from '$app/stores'
	import Loader from '$lib/components/icons/Loader.svelte'
	import { fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import Footer from './Footer.svelte'
	import { beforeNavigate } from '$app/navigation'
	import type { RouteId as ContentPageRouteId } from './[...pageUrl]/$types'
	import type { RouteId as EventPageRouteId } from './event/[slug]/$types'
	import type { RouteId as HomeRouteId } from './$types'
	import { pick } from '$lib/helpers/pick'

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
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>
</svelte:head>

<!-- <SkipNavigation /> -->

<Header items={data.navigationTree} {leftImageUrl} {rightImageUrl} />

<Divider />

<div class="content">
	<main>
		<slot />
	</main>

	<div class="divider" />

	<aside>
		<div class="aside-content">
			<h3 class="heading-3">Kalender</h3>

			<p class="calendar-tutorial">
				💡 Navigiere im Kalender, um vergangene Veranstaltungen zu durchstöbern.
			</p>

			<EventCalendar {events} />

			<h3 class="heading-3">Mitmachen</h3>

			<ParticipateSection {mail} />

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

<Footer imprintUrl={imprintPageSlug && `/${imprintPageSlug}`} />

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.content {
		display: grid;
		// grid-template-columns: auto auto 375px;
		grid-template-columns: 1fr min-content min-content;

		max-width: 1200px;

		margin: 0 auto;
		gap: 2.5rem;

		@include max-md {
			grid-template-columns: 1fr;
		}
	}

	.aside-content {
		position: sticky;
		top: 2rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		.heading-3 {
			margin-bottom: 0;
		}
	}

	.divider {
		width: 2px;
		height: 100%;
		background: rgba(0, 0, 0, 0.05);
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

	.calendar-tutorial {
		font-size: 0.85rem;
		color: var(--color-text-1);
		margin: 0;
	}
</style>
