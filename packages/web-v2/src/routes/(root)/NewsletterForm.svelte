<script lang="ts">
	import { toast } from 'svelte-sonner'
	import { slide } from 'svelte/transition'

	import Button from '#lib/components/Button.svelte'
	import IconSend from '#lib/components/icons/IconSend.svelte'
	import { Checkbox } from '#lib/components/ui/checkbox/index.js'
	import { subscribeToNewsletter } from '#lib/mailer/newsletter.remote.js'

	interface Props {
		privacyUrl: string | undefined
	}

	let { privacyUrl }: Props = $props()

	let accepted = $state(false)
	let disabledAfterSubmit = $state(false)

	const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	let email = $derived(String(subscribeToNewsletter.fields.email.value() ?? ''))
	let isEmailValid = $derived(emailRegexp.test(email) && accepted)
	let showCheckbox = $derived(!!email)

	const enhanced = subscribeToNewsletter.enhance(async ({ submit }) => {
		const id = toast.loading('Anmeldung wird gesendet...')

		const ok = await submit()

		if (ok) {
			toast.success('🎉 Deine Anmeldung ist eingegangen. Vielen Dank!', { id, duration: 5000 })
			disabledAfterSubmit = true
		} else {
			toast.error('Da ist etwas schiefgegangen...\nVersuche es später erneut.', {
				id,
				duration: 5000,
			})
		}
	})

	$effect(() => {
		if (email) disabledAfterSubmit = false
	})
</script>

<form
	{...enhanced}
	class="flex flex-col items-center gap-1 [&_a]:cursor-pointer [&_a]:underline [&_a]:decoration-brand [&_a:focus]:text-brand [&_a:hover]:text-brand [&_button]:rounded-base!"
>
	<input
		{...subscribeToNewsletter.fields.email.as('email')}
		class="h-8 w-full rounded-base border-2 border-brand px-1 py-[calc(0.25rem-8px)] text-[0.9em]"
		placeholder="Deine E-Mail..."
	/>

	{#if showCheckbox}
		<div
			class="mt-1 grid w-full grid-cols-[1fr_auto] items-center gap-1 text-[0.8em]"
			transition:slide={{ duration: 500 }}
		>
			<div class="flex items-start gap-2 text-[0.8em] leading-normal">
				<Checkbox id="acceptPrivacy" bind:checked={accepted} class="mt-[0.2lh]" />

				<!-- bits-ui renders no form control of its own, so submit the value explicitly. -->
				<input type="hidden" name="acceptPrivacy" value={accepted ? 'on' : ''} />

				<label for="acceptPrivacy" class="leading-normal hyphens-auto">
					Ich möchte den Newsletter erhalten und akzeptiere die
					{#if privacyUrl}
						<a href={privacyUrl} target="_blank">Datenschutzrichtlinien</a>.
					{:else}
						Datenschutzrichtlinien.
					{/if}
				</label>
			</div>

			<Button
				size="s"
				type="submit"
				icon={IconSend}
				disabled={!isEmailValid || disabledAfterSubmit}
			/>
		</div>
	{/if}
</form>
