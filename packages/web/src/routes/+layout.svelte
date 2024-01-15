<script lang="ts">
	import Header from './Header.svelte'
	import EventCalendar from '$lib/components/eventCalendar/EventCalendar.svelte'
	import PageSearch from './PageSearch.svelte'
	import DonationLink from '$lib/components/DonationLink.svelte'
	import '$lib/styles/globals.scss'

	export let data

	$: events = data.events.map((e) => ({
		name: e.title,
		url: `/post/${e.slug}`,
		date: new Date(e.eventTime),
	}))
</script>

<Header />

<div class="content">
	<main>
		<slot />
	</main>

	<aside>
		<div class="aside-content">
			<!-- <PageSearch /> -->

			<EventCalendar {events} />

			<DonationLink />
		</div>
	</aside>
</div>

<style lang="scss">
	.content {
		margin: auto;
		max-width: 1200px;
		display: grid;
		grid-template-columns: 1fr max(300px, 20%);
	}

	main {
		padding: 4cm;
	}

	.aside-content {
		position: sticky;
		top: 2rem;

		display: flex;
		flex-direction: column;
		// align-items: center;
		gap: 2rem;
	}
</style>
