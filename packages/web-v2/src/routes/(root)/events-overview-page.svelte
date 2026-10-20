<script lang="ts">
	import { ElementSize } from 'runed'
	import Button from '#lib/components/ui/button/button.svelte'

	import EventsOverview from './events-overview.svelte'
	import { browser } from '$app/env'

	interface Props {
		// TODO: type this
		events: any[]
		year?: number
		month?: number
	}

	let { events }: Props = $props()

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

<Button class="mt-8">Mehr laden</Button>
