<script lang="ts">
	import { page } from '$app/stores'
	import CallToAction from '$lib/components/CallToAction.svelte'
</script>

<div class="participate-section">
	<div class="box">
		<p>
			Sie möchten den Verein und unsere Arbeit finanziell unterstützen? Wir freuen uns über jede
			Spende.
		</p>

		<CallToAction href={$page.data.siteSettings.donationLink}>Spenden via PayPal</CallToAction>
	</div>

	<div class="box">
		<p>Abonnieren Sie gerne unseren Newsletter, um über Neuigkeiten informiert zu werden 😊</p>

		<CallToAction>Zum Newsletter anmelden</CallToAction>
	</div>
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
	}

	.box {
		@include surface;

		border-radius: 24px;
		box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
	}
</style>
