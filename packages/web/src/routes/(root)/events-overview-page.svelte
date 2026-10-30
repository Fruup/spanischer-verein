<script lang="ts">
	import Button from '#lib/components/ui/button/button.svelte'
	import EventsOverview from './events-overview.svelte'
	import { getHeaderHeight } from '#lib/components/header/header.svelte'

	interface Props {
		// TODO: type this
		events: any[]
		/** Whether a further page exists behind "Mehr laden". */
		hasMore: boolean
		loadMore: () => unknown
		loading: boolean
	}

	let { events, hasMore, loadMore, loading }: Props = $props()
</script>

<h3
	id="veranstaltungen"
	style="scroll-margin-top: {getHeaderHeight() + 20}px"
	class="mt-8 mb-4 flex items-center justify-between font-serif text-xl font-bold"
>
	Veranstaltungen & Infos
</h3>

<EventsOverview {events} />

{#if hasMore}
	<Button onclick={loadMore} disabled={loading} class="mt-8">Mehr laden</Button>
{:else}
	<p class="mt-8 text-xs text-ink-muted">Keine weiteren Veranstaltungen.</p>
{/if}
