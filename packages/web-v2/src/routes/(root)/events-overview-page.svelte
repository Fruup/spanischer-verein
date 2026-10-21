<script lang="ts">
	import Button from '#lib/components/ui/button/button.svelte'
	import EventsOverview from './events-overview.svelte'
	import { getHeaderHeight } from '#lib/components/header/header.svelte'

	interface Props {
		// TODO: type this
		events: any[]
		/** Whether a further `?page=` exists behind "Mehr laden". */
		hasMore?: boolean
		/** Zero-based index of the page being shown; `?page=1` is `/`. */
		pageIndex?: number
	}

	let { events, hasMore = false, pageIndex = 0 }: Props = $props()
</script>

<h3
	id="veranstaltungen"
	style="scroll-margin-top: {getHeaderHeight() + 20}px"
	class="mt-8 mb-4 flex items-center justify-between font-serif text-xl font-bold max-desktop:mb-0 max-desktop:flex-col max-desktop:gap-2 max-desktop:self-start"
>
	Veranstaltungen & Infos
</h3>

<EventsOverview {events} />

{#if hasMore}
	<!--
		A link, not a button: the next page is a real URL, which is what makes the
		back catalogue crawlable now that the month archive is gone. Each page is a
		superset of the previous one, so following it reads as an append.
	-->
	<Button
		href="?page={pageIndex + 2}"
		data-sveltekit-noscroll
		class="mt-8"
		onclick={(e) => {
			// In case of enabled JavaScript, load the events directly
			e.preventDefault()
			// TODO:
		}}
	>
		Mehr laden
	</Button>
{/if}
