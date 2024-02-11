<script lang="ts">
	import Header from '../../lib/components/header/Header.svelte'
	import EventCalendar from '$lib/components/eventCalendar/EventCalendar.svelte'
	import DonationLink from '$lib/components/DonationLink.svelte'
	import SkipNavigation from '$lib/components/SkipNavigation.svelte'
	import BackgroundEffect from './BackgroundEffect.svelte'
	import { getEventUrl } from '$lib/helpers/url'

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

<Header />

<BackgroundEffect />

<div class="content">
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

<footer></footer>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.content {
		display: grid;
		grid-template-columns: auto 375px;

		max-width: 1200px;

		margin: 0 auto;
		gap: 5rem;

		@include max-md {
			grid-template-columns: 1fr;
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

		@include surface;

		border-radius: 24px;
		box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.1);

		width: fit-content;
		margin: auto;
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
