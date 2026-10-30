<script lang="ts">
	import Button from '#lib/components/ui/button/button.svelte'
	import * as Card from '#lib/components/ui/card/index.ts'
	import { t } from '#lib/messages/index.ts'

	let { data } = $props()

	const confirmed = $derived(data.confirmed)
</script>

<div class="grid min-h-screen w-screen place-content-center">
	<Card.Root class="w-fit">
		<Card.Header>
			<Card.Title>{t('newsletter_registration_title')}</Card.Title>
			<!-- <Card.Description>Card Description</Card.Description> -->
		</Card.Header>

		<Card.Content class="leading-snug">
			{#if confirmed}
				<p>
					{t('newsletter_confirmed_thanks_1')}<br />
					{t('newsletter_confirmed_thanks_2')}
				</p>
			{:else}
				<p>{t('newsletter_error_heading')}</p>

				<p class="max-w-prose">
					{t('newsletter_error_retry_1')}<br />
					{t('newsletter_error_retry_2')}
					<a href="mailto:info@spanischerverein.com">info@spanischerverein.com</a>.
				</p>
			{/if}
		</Card.Content>

		<Card.Footer>
			<Button href="/">{t('back_to_home')}</Button>
		</Card.Footer>
	</Card.Root>
</div>
