<script lang="ts">
	import * as Dialog from '#lib/components/ui/dialog/index.ts'
	import { Button } from '#lib/components/ui/button/index.ts'

	export interface ConfirmationDialogProps {
		title: string
		description?: string
		onChoice: (choice: boolean) => void
	}

	let { title, description, onChoice }: ConfirmationDialogProps = $props()

	const choice = (choice: boolean) => {
		open = false
		onChoice(choice)
	}

	let open = $state(true)
</script>

<Dialog.Root
	bind:open={
		() => open,
		(value) => {
			if (!value) choice(false)
			else open = value
		}
	}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>

			{#if description}
				<Dialog.Description>{description}</Dialog.Description>
			{/if}

			<Dialog.Footer>
				<Button variant="secondary" onclick={() => choice(false)}>Abbrechen</Button>
				<Button onclick={() => choice(true)}>Bestätigen</Button>
			</Dialog.Footer>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
