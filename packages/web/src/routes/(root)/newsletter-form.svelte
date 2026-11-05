<script lang="ts">
	import { toast } from 'svelte-sonner'
	import { slide } from 'svelte/transition'

	import { duration as motionDuration, motion } from '#lib/helpers/motion.js'

	import { Button } from '#lib/components/ui/button/index.ts'
	import { Checkbox } from '#lib/components/ui/checkbox/index.js'
	import { subscribeToNewsletter } from '#lib/mailer/newsletter.remote.js'
	import { newsletterSchema } from '#lib/mailer/newsletter.ts'
	import Input from '#lib/components/ui/input/input.svelte'
	import { CircleCheckIcon, SendIcon } from '@lucide/svelte'
	import { t } from '#lib/messages/index.ts'
	import type { RemoteFormIssue } from '$app/server'

	interface Props {
		privacyUrl: string | undefined | null
	}

	let { privacyUrl }: Props = $props()

	let success = $state(false)

	/**
	 * The checkbox is a `bits-ui` button with a hidden input, so the remote form
	 * only learns its state from the submitted `FormData` — we track it here to
	 * drop its issue the moment it is ticked.
	 */
	let accepted = $state(false)

	const schema = newsletterSchema()

	const emailIssues = $derived(subscribeToNewsletter.fields.email.issues())
	const privacyIssues = $derived(
		accepted ? undefined : subscribeToNewsletter.fields.acceptPrivacy.issues(),
	)
	/** Issues the server attached to the submission as a whole, e.g. a failed send. */
	const formIssues = $derived(subscribeToNewsletter.fields.issues())

	$effect(() => {
		if (subscribeToNewsletter.fields.email.value()) success = false
	})

	// Re-run the client-side checks while editing, so a message goes away as soon
	// as it no longer applies. Only after a first attempt — no nagging before.
	$effect(() => {
		if (!subscribeToNewsletter.submitted) return
		subscribeToNewsletter.fields.value()
		const timer = setTimeout(() => subscribeToNewsletter.validate({ preflightOnly: true }), 300)
		return () => clearTimeout(timer)
	})
</script>

<div class="space-y-4">
	<!-- `novalidate`: the browser would otherwise block the submit with its own
	     untranslated bubble before the schema gets to report the issue. -->
	<form
		novalidate
		{...subscribeToNewsletter.preflight(schema).enhance(async ({ submit }) => {
			const ok = await submit()

			if (ok) {
				success = true
			} else if (!subscribeToNewsletter.fields.allIssues()?.length) {
				// Nothing to show on a field — fall back to the generic message.
				toast.error(t('newsletter_generic_error'), { duration: 5000 })
			}
		})}
		class="flex flex-col items-center gap-1 [&_a]:cursor-pointer [&_a]:underline [&_a]:decoration-brand-link [&_a]:underline-offset-4 [&_a:focus]:text-brand-link [&_a:hover]:text-brand-link"
	>
		<Input
			{...subscribeToNewsletter.fields.email.as('email')}
			class="h-10 w-full rounded-base border border-edge bg-surface-0 px-3 text-sm text-ink focus-ring transition-colors placeholder:text-ink-muted hover:border-brand/60 focus-visible:border-brand aria-invalid:border-destructive aria-invalid:hover:border-destructive"
			placeholder={t('email_placeholder')}
			disabled={success || !!subscribeToNewsletter.pending}
		/>

		{@render _issues(emailIssues)}

		{#if !!subscribeToNewsletter.fields.email.value()}
			<div
				class="mt-2 flex w-full flex-col gap-4 text-xs"
				transition:slide={{ duration: motion(motionDuration.slow) }}
			>
				<div class="flex flex-col gap-1">
					<div class="flex items-start gap-2 text-2xs leading-normal">
						<Checkbox
							{...subscribeToNewsletter.fields.acceptPrivacy.as('checkbox')}
							bind:checked={accepted}
							type="button"
							id="acceptPrivacy"
							class="mt-[0.2lh]"
							disabled={success || !!subscribeToNewsletter.pending}
						/>

						<label for="acceptPrivacy" class="leading-snug hyphens-auto">
							{t('newsletter_consent')}
							{#if privacyUrl}
								<a href={privacyUrl} target="_blank">{t('privacy_policy_link_text')}</a>.
							{:else}
								{t('privacy_policy_link_text')}.
							{/if}
						</label>
					</div>

					{@render _issues(privacyIssues)}
				</div>

				{@render _issues(formIssues)}

				<Button size="sm" type="submit" disabled={success || !!subscribeToNewsletter.pending}>
					{t('submit')}
					<SendIcon />
				</Button>
			</div>
		{/if}
	</form>

	{#if success}
		<div in:slide={{ axis: 'y' }} class="space-y-1 *:text-xs! *:leading-snug">
			<p class="font-semibold">
				{t('perfect')}
				<CircleCheckIcon class="text-success inline size-4" />
			</p>
			<p>
				{t('newsletter_success_description')}
			</p>
		</div>
	{/if}
</div>

{#snippet _issues(issues: RemoteFormIssue[] | undefined)}
	{#if issues?.length}
		<ul
			class="w-full space-y-0.5 text-2xs leading-snug text-destructive"
			transition:slide={{ duration: motion(motionDuration.fast) }}
		>
			{#each issues as issue (issue.message)}
				<li>{issue.message}</li>
			{/each}
		</ul>
	{/if}
{/snippet}
