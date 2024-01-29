<script lang="ts">
	import Header from './Header.svelte'
	import EventCalendar from '$lib/components/eventCalendar/EventCalendar.svelte'
	import PageSearch from './PageSearch.svelte'
	import DonationLink from '$lib/components/DonationLink.svelte'
	import SkipNavigation from '$lib/components/SkipNavigation.svelte'
	import { getEventUrl } from '$lib/helpers/url'
	import type { LayoutData } from './$types'
	import { page } from '$app/stores'

	const { data } = $props<{ data: LayoutData }>()

	const isEventPage = $derived($page.route.id?.includes('event'))

	const events = $derived(
		data.upcomingEvents.map((e) => ({
			name: e.title,
			url: getEventUrl(e.slug),
			date: new Date(e.eventTime),
		})),
	)
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>
</svelte:head>

<SkipNavigation />

<Header />

<div aria-hidden class="background-effect" class:isEventPage>
	<div />
</div>

<div class="content">
	<aside></aside>

	<main>
		<slot />
	</main>

	<aside>
		<div class="aside-content">
			<h5>Zukünftige Veranstaltungen</h5>
			<EventCalendar {events} />

			<h5>
				<DonationLink />
			</h5>

			<!-- <PageSearch /> -->
		</div>
	</aside>
</div>

<footer>I am a footer</footer>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.content {
		display: grid;
		grid-template-columns: 1fr min(1000px) 1fr;

		gap: 3rem;

		@include max-md {
			grid-template-columns: 1fr;
		}
	}

	.background-effect {
		z-index: -1000;
		height: 0;
		overflow: visible;

		position: relative;

		div {
			position: absolute;
			inset: 0;
			height: 100px;
			// z-index: -1000;

			transform-origin: center;

			transform: skewY(-3deg) translateY(-50%);

			background-color: color.change($color-accent, $alpha: 1);
			// background-color: rgba(255, 68, 0, 0.5);

			transition: transform 500ms ease;
		}

		&.isEventPage div {
			background-color: color.change($color-accent, $alpha: 1);
			transform: scaleY(3) skewY(1deg) translateY(20%);
		}
	}

	main {
		padding: 0 2rem;
	}

	.aside-content {
		position: sticky;
		top: 2rem;

		display: flex;
		flex-direction: column;
		gap: 2rem;

		padding: 2rem;

		background-color: rgba(0, 0, 0, 0.02);
		border-radius: 24px;
		box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.1);
	}

	h5 {
		margin: 0;

		align-self: center;
	}

	footer {
		display: grid;
		place-items: center;

		min-height: 200px;
		margin-top: 8rem;
		background-color: rgba(0, 0, 0, 0.02);
	}
</style>
