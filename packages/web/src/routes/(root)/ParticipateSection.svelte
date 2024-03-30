<script lang="ts">
	import { page } from '$app/stores'
	import CallToAction from '$lib/components/CallToAction.svelte'
</script>

<div class="participate-section">
	<p>
		Sie möchten den Verein und unsere Arbeit finanziell unterstützen? Wir freuen uns über jede
		Spende.
	</p>

	<CallToAction href={$page.data.siteSettings.donationLink}>Spenden via PayPal</CallToAction>

	<p>Abonnieren Sie gerne unseren Newsletter, um über Neuigkeiten informiert zu werden 😊</p>

	<CallToAction>Zum Newsletter anmelden</CallToAction>
</div>

<style lang="scss">
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
	}
</style>
