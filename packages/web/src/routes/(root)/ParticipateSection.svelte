<script lang="ts">
	import { page } from '$app/stores'
	import CallToAction from '$lib/components/CallToAction.svelte'
	import Card from './Card.svelte'
	import NewsletterForm from './NewsletterForm.svelte'

	export let mail: string
	export let privacyUrl: string

	const IBAN = 'DE52 3705 0198 0017 7420 40'

	$: ibanParts = (() => {
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
	})()
</script>

<div class="participate-section">
	<Card>
		<p slot="heading">Du möchtest den Verein und unsere Arbeit finanziell unterstützen?</p>

		<p>Wir freuen uns über jede Spende!</p>

		<CallToAction href={$page.data.siteSettings.donationLink}>Spenden via PayPal</CallToAction>

		{#if ibanParts}
			<p>Oder per Überweisung an:</p>

			<p class="bank-details">
				<span>Sparkasse KoelnBonn</span>
				<br />

				<span class="iban">
					{#each ibanParts as item}<span>{item}</span>{/each}
				</span>
				<br />

				<span>SWIFT-BIC: COLSDE33</span>
			</p>
		{/if}
	</Card>

	<Card>
		<p slot="heading">Du möchtest über unsere Angebote auf dem Laufenden bleiben?</p>

		<p>Melde dich zu unserem Newsletter an!</p>

		<NewsletterForm {privacyUrl} />
	</Card>

	{#if mail}
		<Card>
			<p slot="heading">Du möchtest selbst einen Kurs oder ein Event anbieten?</p>

			<p>
				Schreib uns an! - <a href="mailto:{mail}"> {mail} </a>
			</p>
		</Card>
	{/if}
</div>

<style lang="scss">
	@import 'vars';

	.participate-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		> * {
			margin-top: 0;
			margin-bottom: 0;
		}
	}

	p {
		font-size: 0.9rem;
		margin-top: 0;

		&:last-child {
			margin-bottom: 0;
		}
	}

	a {
		text-decoration: underline;
		text-decoration-color: $color-accent;

		&:hover,
		&:focus {
			color: $color-accent;
		}
	}

	.bank-details {
		font-size: 0.85em;
	}

	.iban span {
		margin-right: 6px;
	}
</style>
