<script lang="ts">
	import EventCalendar from '#lib/components/event-calendar/event-calendar.svelte'
	import Header from '#lib/components/header/header.svelte'
	import { mobileMenu } from '#lib/components/header/mobile-menu.svelte'
	import MobileNavigationBar from '#lib/components/navigation/mobile-navigation-bar.svelte'
	import { Toaster } from '#lib/components/ui/sonner/index.js'
	import { getEventUrl } from '#lib/helpers/url.js'
	import {
		getEventsOverview,
		getNavigationTree,
		getPastHighlights,
		getSiteSettings,
	} from '#lib/sanity/sanity.remote.js'
	import Divider from './divider.svelte'
	import Footer from './footer.svelte'
	import { mobileCalendar } from './mobile-calendar.svelte'
	import ParticipateSection from './participate-section.svelte'
	import type { LayoutProps } from './$types'
	import NavigationIndicator from './navigation-indicator.svelte'
	import { CalendarIcon, UsersIcon } from '@lucide/svelte'
	import SidebarHeading from './sidebar-heading.svelte'
	import { t } from '#lib/messages/index.ts'

	let { children }: LayoutProps = $props()

	const siteSettings = await getSiteSettings()
	const navigationTree = await getNavigationTree()

	const currentMonth = (() => {
		const now = new Date()
		return { year: now.getFullYear(), month: now.getMonth() + 1 }
	})()
	const events = $derived.by(async () => {
		const e = await getEventsOverview(currentMonth)
		return e.map((event) => ({
			name: event.title,
			url: getEventUrl(event.slug),
			date: new Date(event.eventTime),
		}))
	})

	const mail = $derived(siteSettings?.contactEmail ?? 'info@spanischer-verein.com')
	const imprintUrl = $derived(siteSettings?.imprintPageSlug && `/${siteSettings.imprintPageSlug}`)
	const privacyUrl = $derived(siteSettings?.privacyPageSlug && `/${siteSettings.privacyPageSlug}`)

	const getCalendarEvents = async (year: number, month: number) => {
		if (year === currentMonth.year && month === currentMonth.month) {
			return events
		}

		const results = await getEventsOverview({ year, month })

		return results.map(({ title, eventTime, slug }) => ({
			name: title,
			date: new Date(eventTime),
			url: getEventUrl(slug),
		}))
	}
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>

	{#if siteSettings?.logoUrl}
		<link rel="icon" href={siteSettings.logoUrl} />
	{/if}
</svelte:head>

<Toaster position="bottom-center" />
<NavigationIndicator />

<Header
	items={navigationTree}
	headerImages={siteSettings?.headerImages ?? []}
	highlightedEvents={await getPastHighlights()}
/>
<MobileNavigationBar
	bind:isCalendarOpen={mobileCalendar.open}
	bind:isFlyoutOpen={mobileMenu.open}
/>

<Divider />

<div
	class="mx-auto box-content grid max-w-[1200px] [grid-template-columns:1fr_min-content_min-content] gap-10 px-10 max-desktop:grid-cols-1 max-tablet:px-4"
>
	<main class="mt-10 mb-16 max-desktop:mb-0 [&_h3:first-of-type]:mt-0">
		{@render children?.()}
	</main>

	<div class="h-full w-[2px] bg-hairline max-desktop:h-[2px] max-desktop:w-auto"></div>

	<aside class="mt-10 mb-16 [&_h3:first-of-type]:mt-0">
		<div
			class="sticky top-8 flex flex-col gap-4 max-desktop:mx-auto max-desktop:max-w-[500px] max-desktop:items-center"
		>
			<!-- The desktop calendar; on narrow screens it moves into a drawer. -->
			<div class="max-desktop:hidden">
				<SidebarHeading icon={CalendarIcon}>
					{t('calendar')}

					{#snippet description()}
						Finde passende Veranstaltungen
					{/snippet}
				</SidebarHeading>

				<EventCalendar getEvents={getCalendarEvents} />
			</div>

			<!-- <MobileCalendar {events} /> -->
			<div class="mt-4">
				<SidebarHeading icon={UsersIcon}>
					Mitmachen

					{#snippet description()}
						Du willst uns unterstützen oder dich selbst einbringen?
					{/snippet}
				</SidebarHeading>

				<ParticipateSection {mail} {privacyUrl} donationLink={siteSettings?.donationLink} />
			</div>
		</div>
	</aside>
</div>

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
