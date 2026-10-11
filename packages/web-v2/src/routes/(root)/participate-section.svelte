<script lang="ts">
	import CallToAction from '#lib/components/call-to-action.svelte'

	import Card from './card.svelte'
	import NewsletterForm from './newsletter-form.svelte'

	interface Props {
		mail: string
		privacyUrl: string | undefined
		donationLink: string | undefined
	}

	let { mail, privacyUrl, donationLink }: Props = $props()

	const IBAN = 'DE52 3705 0198 0017 7420 40'

	let ibanParts = $derived.by(() => {
		const ir = IBAN.replace(/\s+/g, '')

		if (ir.length !== 22) return

		return [
			ir.slice(0, 4),
			ir.slice(4, 8),
			ir.slice(8, 12),
			ir.slice(12, 16),
			ir.slice(16, 20),
			ir.slice(20, 22),
		]
	})
</script>

<div
	class="flex flex-col gap-4 [&_a]:underline [&_a]:decoration-brand-link [&_a]:underline-offset-4 [&_a:focus]:text-brand-link [&_a:hover]:text-brand-link [&_p]:mt-0 [&_p]:text-sm [&_p:last-child]:mb-0 [&>*]:my-0"
>
	<Card>
		{#snippet heading()}
			<p>Du möchtest den Verein und unsere Arbeit finanziell unterstützen?</p>
		{/snippet}

		<p>Wir freuen uns über jede Spende!</p>

		<CallToAction href={donationLink}>Spenden via PayPal</CallToAction>

		{#if ibanParts}
			<p>Oder per Überweisung an:</p>

			<p class="text-xs">
				<span>Sparkasse KoelnBonn</span>
				<br />

				<span class="tabular-nums [&>span]:mr-[0.5ch]">
					{#each ibanParts as part, partIndex (partIndex)}<span>{part}</span>{/each}
				</span>
				<br />

				<span>SWIFT-BIC: COLSDE33</span>
			</p>
		{/if}
	</Card>

	<Card>
		{#snippet heading()}
			<p>Du möchtest über unsere Angebote auf dem Laufenden bleiben?</p>
		{/snippet}

		<p>Melde dich zu unserem Newsletter an!</p>

		<NewsletterForm {privacyUrl} />
	</Card>

	{#if mail}
		<Card>
			{#snippet heading()}
				<p>Du möchtest selbst einen Kurs oder ein Event anbieten?</p>
			{/snippet}

			<p>
				Schreib uns an! - <a href="mailto:{mail}"> {mail} </a>
			</p>
		</Card>
	{/if}
</div>
