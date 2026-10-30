<script lang="ts">
	import Button from '#lib/components/ui/button/button.svelte'

	import Card from './card.svelte'
	import NewsletterForm from './newsletter-form.svelte'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		mail: string
		privacyUrl: string | undefined | null
		donationLink: string | undefined | null
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
			{t('support_us_heading')}
		{/snippet}

		<p>{t('donation_intro')}</p>

		<Button href={donationLink} target="_blank">{t('donate_via_paypal')}</Button>

		{#if ibanParts}
			<p>{t('or_via_bank_transfer')}</p>

			<p class="font-mono text-2xs">
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
			{t('stay_updated_heading')}
		{/snippet}

		<p>{t('newsletter_signup_intro')}</p>

		<NewsletterForm {privacyUrl} />
	</Card>

	{#if mail}
		<Card>
			{#snippet heading()}
				{t('offer_course_heading')}
			{/snippet}

			<p>
				{t('write_us_mail')} <a href="mailto:{mail}"> {mail} </a>
			</p>
		</Card>
	{/if}
</div>
