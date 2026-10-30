<script lang="ts">
	import { toast } from 'svelte-sonner'
	import { slide } from 'svelte/transition'

	import { duration as motionDuration, motion } from '#lib/helpers/motion.js'

	import { Button } from '#lib/components/ui/button/index.ts'
	import { Checkbox } from '#lib/components/ui/checkbox/index.js'
	import { subscribeToNewsletter } from '#lib/mailer/newsletter.remote.js'
	import Input from '#lib/components/ui/input/input.svelte'
	import { CircleCheckIcon, SendIcon } from '@lucide/svelte'

	interface Props {
		privacyUrl: string | undefined
	}

	let { privacyUrl }: Props = $props()

	let success = $state(false)

	$effect(() => {
		if (subscribeToNewsletter.fields.email.value()) success = false
	})
</script>

<div class="space-y-4">
	<form
		{...subscribeToNewsletter.enhance(async ({ submit }) => {
			// const id = toast.loading('Anmeldung wird gesendet...')

			const ok = await submit()

			if (ok) {
				// toast.success('🎉 Deine Anmeldung ist eingegangen. Vielen Dank!', { id, duration: 5000 })
				success = true
			} else {
				toast.error('Da ist etwas schiefgegangen...\nVersuche es später erneut.', {
					// id,
					duration: 5000,
				})
			}
		})}
		class="flex flex-col items-center gap-1 [&_a]:cursor-pointer [&_a]:underline [&_a]:decoration-brand-link [&_a]:underline-offset-4 [&_a:focus]:text-brand-link [&_a:hover]:text-brand-link"
	>
		<Input
			{...subscribeToNewsletter.fields.email.as('email')}
			class="h-10 w-full rounded-base border border-edge bg-surface-0 px-3 text-sm text-ink focus-ring transition-colors placeholder:text-ink-muted hover:border-brand/60 focus-visible:border-brand"
			placeholder="Deine Email..."
			disabled={success || !!subscribeToNewsletter.pending}
		/>

		{#if !!subscribeToNewsletter.fields.email.value()}
			<div
				class="mt-2 flex w-full flex-col gap-4 text-xs"
				transition:slide={{ duration: motion(motionDuration.slow) }}
			>
				<div class="flex items-start gap-2 text-2xs leading-normal">
					<Checkbox
						{...subscribeToNewsletter.fields.acceptPrivacy.as('checkbox')}
						type="button"
						id="acceptPrivacy"
						class="mt-[0.2lh]"
						disabled={success || !!subscribeToNewsletter.pending}
					/>

					<label for="acceptPrivacy" class="leading-snug hyphens-auto">
						Ich möchte den Newsletter erhalten und akzeptiere die
						{#if privacyUrl}
							<a href={privacyUrl} target="_blank">Datenschutzrichtlinien</a>.
						{:else}
							Datenschutzrichtlinien.
						{/if}
					</label>
				</div>

				<Button size="sm" type="submit" disabled={success || !!subscribeToNewsletter.pending}>
					Absenden <SendIcon />
				</Button>
			</div>
		{/if}
	</form>

	{#if success}
		<div in:slide={{ axis: 'y' }} class="space-y-1 *:text-xs! *:leading-snug">
			<p class="font-semibold">
				Perfekt!
				<CircleCheckIcon class="text-success inline size-4" />
			</p>
			<p>
				Wir haben einen Anmeldungslink an deine Email geschickt. Bitte klicke darauf, um deine
				Anmeldung zu betätigen.
			</p>
		</div>
	{/if}
</div>
