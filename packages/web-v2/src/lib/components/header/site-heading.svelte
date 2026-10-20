<script lang="ts">
	import { fade, slide } from 'svelte/transition'
	import Button from '../ui/button/button.svelte'
	import { isMainPage } from './helpers.svelte'
</script>

<div class="max-w-prose">
	<h1
		transition:fade={{ delay: 0, duration: 100 }}
		class="mb-4 font-serif text-2xl font-black [text-shadow:0_0_12px_var(--header-fade)]"
	>
		Spanische Kultur,<br />
		mitten in Köln
	</h1>

	{#if isMainPage()}
		<p class="my-2 max-w-prose text-sm leading-snug text-ink/70">
			Tanz, Kino, Küche und Sprache – wir bringen Spanierinnen, Spanier und alle Freunde Spaniens
			zusammen! Hier findest du unsere nächsten Termine und Neuigkeiten aus dem Verein.
		</p>

		<p class="my-2 max-w-prose text-sm leading-snug text-ink/70">
			Deutsch-Spanischer gemeinnütziger Kulturkreis Machado e.V.
		</p>
	{/if}

	<div transition:slide={{ axis: 'y', duration: 500 }} class="flex gap-2 pt-2">
		<Button href="/#veranstaltungen">Anstehende Termine ansehen</Button>
		<Button variant="secondary" href="/ueber-uns">Über uns</Button>
	</div>
</div>
