<script lang="ts" module>
	type TNewsletter = Exclude<Awaited<ReturnType<typeof sanityApi.getNewsletter>>, null>

	export type NewsletterContext = {
		newsletter: TNewsletter
		urlParams: URLSearchParams
	}
</script>

<script lang="ts">
	import BlockContent from './blockContent/BlockContent.svelte'
	import EventsOverview from '../../routes/(root)/EventsOverview.svelte'
	import '$lib/styles/globals.scss'
	import type { sanityApi } from '$lib/sanity/client'
	import SiteLogo from './header/SiteLogo.svelte'
	import { setContext } from 'svelte'
	import { PUBLIC_ORIGIN } from '$env/static/public'

	let {
		newsletter,
	}: {
		newsletter: TNewsletter
	} = $props()

	const urlParams = new URLSearchParams({
		utm_source: 'newsletter',
		utm_campaign: newsletter.slug,
	})

	setContext<NewsletterContext>('newsletter', {
		newsletter,
		urlParams,
	})
</script>

<div class="prose m-auto max-w-[768px] p-4">
	<h1 class="heading text-3xl font-bold">{newsletter.title}</h1>

	<div class="my-4">
		<BlockContent body={newsletter.content} />
	</div>

	<h2 class="heading-2">Vorgestellte Events</h2>

	<div class="not-prose">
		<EventsOverview events={newsletter.featuredEvents} />
	</div>

	<footer class="mx-auto mt-16 max-w-[66%] text-center text-xs">
		<SiteLogo href="{PUBLIC_ORIGIN}?{urlParams}" />

		<p>
			<strong>Spanische Kultur in Köln</strong> - Deutsch-Spanischer gemeinnütziger Kulturkreis Machado
			e.V.
		</p>

		<p class="*:mx-1 *:text-gray-500">
			<a href="{PUBLIC_ORIGIN}/newsletter/{newsletter.slug}?{urlParams}">Web-Version</a>
		</p>
	</footer>
</div>

<style lang="scss">
	@import '../styles/vars.scss';

	.heading {
		@include font-serif;
	}
</style>
