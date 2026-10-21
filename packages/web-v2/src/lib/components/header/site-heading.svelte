<script lang="ts">
	import Button from '../ui/button/button.svelte'
</script>

<div class="max-w-prose">
	<p class="mb-3 flex items-center gap-2 text-2xs font-bold tracking-label text-brand uppercase">
		<span aria-hidden="true" class="h-px w-6 bg-brand"></span>
		Deutsch-Spanischer Kulturkreis Machado e.V.
	</p>

	<h1
		class="mb-5 font-serif text-[clamp(2.5rem,5.5vw,4rem)]/[1.02] font-black tracking-tight text-balance"
	>
		Spanische Kultur,<br />
		<span class="text-brand">mitten in Köln</span>
	</h1>

	<p class="my-2 max-w-prose text-sm leading-snug text-ink/80">
		Tanz, Kino, Küche und Sprache – wir bringen Spanierinnen, Spanier und alle Freunde Spaniens
		zusammen! Hier findest du unsere nächsten Termine und Neuigkeiten aus dem Verein.
	</p>

	<div class="flex gap-2 pt-4">
		<Button href="/#veranstaltungen">Anstehende Termine ansehen</Button>
		<Button variant="secondary" href="/ueber-uns">Über uns</Button>
	</div>
</div>
