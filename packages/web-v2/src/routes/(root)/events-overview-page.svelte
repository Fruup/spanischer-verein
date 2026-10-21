<script lang="ts">
	import { ElementSize } from 'runed'
	import Button from '#lib/components/ui/button/button.svelte'

	import EventsOverview from './events-overview.svelte'
	import { browser } from '$app/env'

	interface Props {
		// TODO: type this
		events: any[]
		/** Whether a further `?page=` exists behind "Mehr laden". */
		hasMore?: boolean
		/** Zero-based index of the page being shown; `?page=1` is `/`. */
		pageIndex?: number
	}

	let { events, hasMore = false, pageIndex = 0 }: Props = $props()

	const headerHeight = new ElementSize(() => (browser ? document.querySelector('header') : null))
</script>

<h3
	id="veranstaltungen"
	style="scroll-margin-top: {headerHeight.height + 20}px"
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
	<Button href="?page={pageIndex + 2}" data-sveltekit-noscroll class="mt-8">Mehr laden</Button>
{/if}
