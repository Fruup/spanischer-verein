<script lang="ts">
	import Button from '../ui/button/button.svelte'
	import { t } from '#lib/messages/index.ts'
	import { getSiteSettings } from '#lib/api/content-api.remote.ts'

	const aboutPageSlug = $derived((await getSiteSettings())?.aboutPageSlug)
</script>

<div class="max-w-prose">
	<!--
		The rule keeps to the first line of the label rather than centring against
		a block that is two lines deep on a phone, and the label itself wraps
		evenly instead of dropping `e.V.` onto a line of its own.
	-->
	<p class="mb-3 flex items-start gap-2 text-2xs font-bold tracking-label text-brand uppercase">
		<span aria-hidden="true" class="mt-[0.75em] h-px w-6 shrink-0 bg-brand"></span>
		<span class="text-balance">Deutsch-Spanischer Kulturkreis Machado e.V.</span>
	</p>

	<h1
		class="mb-4 font-serif text-[clamp(2.25rem,5.5vw,4rem)]/[1.05] font-black tracking-tight text-balance"
	>
		{t('hero_title_line1')}<br />
		<span class="text-brand">{t('hero_title_line2')}</span>
	</h1>

	<p class="my-2 max-w-prose text-sm leading-snug text-ink/80">
		{t('hero_description')}
	</p>

	<div class="flex flex-wrap gap-2 pt-4">
		<Button href="/#veranstaltungen">{t('view_upcoming_events')}</Button>

		{#if aboutPageSlug}
			<Button variant="secondary" href="/{aboutPageSlug}">{t('about_us')}</Button>
		{/if}
	</div>
</div>
