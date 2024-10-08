<script lang="ts">
	import Button from '$lib/components/Button.svelte'
	import IconSend from '$lib/components/icons/IconSend.svelte'
	import Checkbox from '$lib/components/ui/Checkbox.svelte'
	import { slide } from 'svelte/transition'
	import { toast } from 'svelte-french-toast'

	export let privacyUrl: string | undefined

	let email = ''
	let checked = false
	let disabledAfterSubmit = false

	const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	$: isNewsletterEmailValid = email && emailRegexp.test(email) && checked
	$: showCheckbox = !!email

	async function handleSubmit() {
		if (!isNewsletterEmailValid) return

		try {
			const params = new URLSearchParams({
				email,
			})

			const promise = fetch(`/api/v1/newsletter/subscribe?${params}`).then((response) => {
				if (!response.ok) {
					console.error(response)
					throw new Error(`${response.status} - ${response.statusText}`)
				}
			})

			await toast.promise(
				promise,
				{
					loading: 'Anmeldung wird gesendet...',
					success: '🎉 Deine Anmeldung ist eingegangen. Vielen Dank!',
					error: 'Da ist etwas schiefgegangen...\nVersuche es später erneut.',
				},
				{ duration: 5000 },
			)

			disabledAfterSubmit = true
		} catch (error) {
			console.error(error)
		}
	}

	$: if (email) {
		disabledAfterSubmit = false
	}
</script>

<form on:submit|preventDefault={() => {}}>
	<input
		type="email"
		class="input-email"
		name="email"
		bind:value={email}
		placeholder="Deine E-Mail..."
	/>

	{#if showCheckbox}
		<div class="checkbox" transition:slide={{ duration: 500 }}>
			<Checkbox name="acceptPrivacy" bind:checked>
				<p slot="label" class="label">
					Ich möchte den Newsletter erhalten und akzeptiere die
					{#if privacyUrl}
						<a href={privacyUrl} target="_blank">Datenschutzrichtlinien</a>.
					{:else}
						Datenschutzrichtlinien.
					{/if}
				</p>
			</Checkbox>

			<Button
				size="s"
				type="submit"
				icon={IconSend}
				disabled={!isNewsletterEmailValid || disabledAfterSubmit}
				onClick={handleSubmit}
			>
				<!-- Anmelden -->
			</Button>
		</div>
	{/if}
</form>

<style lang="scss">
	@import 'vars';

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;

		.input-email,
		.checkbox {
			width: 100%;
		}

		.input-email {
			height: 2rem;
			font-size: 0.9em;
			padding: calc(0.25rem - 8px) 0.25rem;
			border: 2px solid $color-accent;
			border-radius: var(--border-radius);
		}

		:global(button) {
			border-radius: var(--border-radius) !important;
		}

		.checkbox {
			margin-top: 0.25rem;

			display: grid;
			grid-template-columns: 1fr auto;
			align-items: center;
			gap: 4px;

			font-size: 0.8em;

			input {
				height: 0.8rem;
				width: 0.8rem;
			}
		}

		:global(.checkbox) {
			font-size: 0.8em;
			line-height: 1.5;
		}

		.label {
			hyphens: auto;
			line-height: 1.5;
		}

		a {
			text-decoration: underline;
			text-decoration-color: $color-accent;

			cursor: pointer;

			&:hover,
			&:focus {
				color: $color-accent;
			}
		}
	}
</style>
