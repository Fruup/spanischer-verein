<script lang="ts">
	import Header from '../../lib/components/header/Header.svelte'
	import EventCalendar from '$lib/components/eventCalendar/EventCalendar.svelte'
	import SkipNavigation from '$lib/components/SkipNavigation.svelte'
	import Divider from './DividerV2.svelte'
	import { getEventUrl } from '$lib/helpers/url'
	import Archive from './Archive.svelte'
	import ParticipateSection from './ParticipateSection.svelte'

	export let data

	$: events = data.upcomingEvents.map((e) => ({
		name: e.title,
		url: getEventUrl(e.slug),
		date: new Date(e.eventTime),
	}))
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>
</svelte:head>

<!-- <SkipNavigation /> -->

<Header items={data.navigationTree} />

<Divider />

<div class="content">
	<main>
		<slot />
	</main>

	<div class="divider" />

	<aside>
		<div class="aside-content">
			<h3 class="heading-3">Kalender</h3>
			<EventCalendar {events} />

			<h3 class="heading-3">Mitmachen</h3>

			<ParticipateSection />

			<!-- <PageSearch /> -->

			<h3 class="heading-3">Archiv</h3>
			<Archive {events} />
		</div>
	</aside>
</div>

<footer></footer>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.content {
		display: grid;
		grid-template-columns: auto auto 375px;

		max-width: 1200px;

		margin: 0 auto;
		// padding-top: 3rem;
		gap: 4rem;

		@include max-md {
			grid-template-columns: 1fr;
		}
	}

	main {
		// margin-top: 2rem;
	}

	.aside-content {
		position: sticky;
		top: 2rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h5 {
		margin: 0;

		align-self: center;
	}

	footer {
		display: grid;
		place-items: center;

		min-height: 200px;
		// margin-top: 8rem;
		background-color: rgba(0, 0, 0, 0.02);
	}

	.divider {
		width: 2px;
		height: 100%;
		// background: linear-gradient(
		// 	to bottom,
		// 	color.adjust($color-accent, $lightness: -10%),
		// 	$color-accent
		// );

		background: rgba(0, 0, 0, 0.05);
	}
</style>
