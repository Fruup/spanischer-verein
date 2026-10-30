<script lang="ts">
	import Button from '#lib/components/ui/button/button.svelte'
	import * as Card from '#lib/components/ui/card/index.ts'

	let { data } = $props()

	const confirmed = $derived(data.confirmed)
</script>

<div class="grid min-h-screen w-screen place-content-center">
	<Card.Root class="w-fit">
		<Card.Header>
			<Card.Title>Newsletter-Anmeldung</Card.Title>
			<!-- <Card.Description>Card Description</Card.Description> -->
		</Card.Header>

		<Card.Content class="leading-snug">
			{#if confirmed}
				<p>
					Vielen Dank!<br />
					Wir fügen Dich gerne zu unserer Liste hinzu 😊
				</p>
			{:else}
				<p>Da ist etwas schiefgegangen... 😕</p>

				<p class="max-w-prose">
					Versuche es bitte später erneut,<br />
					oder schreib' uns eine Mail an
					<a href="mailto:info@spanischerverein.com">info@spanischerverein.com</a>.
				</p>
			{/if}
		</Card.Content>

		<Card.Footer>
			<Button href="/">Zurück zur Startseite</Button>
		</Card.Footer>
	</Card.Root>
</div>
