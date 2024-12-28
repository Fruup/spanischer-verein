<script lang="ts">
	import BlockContent from './blockContent/BlockContent.svelte'
	import type { PortableTextBlock } from '@portabletext/types'
	import type { EventSchema } from '@spanischer-verein/sanity/schemas/event'
	import EventsOverview from '../../routes/(root)/EventsOverview.svelte'
	import '$lib/styles/globals.scss'

	let {
		title,
		content,
		events,
	}: {
		title: string
		content: PortableTextBlock[]
		events: EventSchema[]
	} = $props()
</script>

<div class="container">
	<!-- <Email.Container> -->
	<h1>{title}</h1>
	<!-- </Email.Container> -->

	<!-- <Email.Section> -->
	<BlockContent body={content} />
	<!-- </Email.Section> -->

	<!-- <Email.Section> -->
	<EventsOverview {events} />
	<!-- </Email.Section> -->
</div>

<style lang="scss">
	.container {
		padding: 1rem;
		margin: auto;
		max-width: 768px;
	}
</style>
