<script lang="ts">
	import Button from '#lib/components/ui/button/button.svelte'
	import * as Dialog from '#lib/components/ui/dialog/index.ts'
	import { logout } from './admin-login.remote'
	import { toast } from 'svelte-sonner'
	import { adminLoginState } from './admin-login-state.svelte'
	import { runConfirmationDialog } from '../components/confirmation-dialog'

	interface Props {
		open: boolean
	}

	let { open = $bindable() }: Props = $props()

	const handleLogoutSuccess = () => {
		open = false
		toast.success('Erfolgreich ausgeloggt!')
		adminLoginState.update()
	}
</script>

<div class="flex flex-col gap-2">
	<p class="text-xs text-muted-foreground">Du bist gerade als Admin eingeloggt.</p>

	<Dialog.Footer>
		<form
			{...logout.enhance(async (form) => {
				if (
					!(await runConfirmationDialog({
						title: 'Wirklich ausloggen?',
					}))
				) {
					return
				}

				if (await form.submit()) {
					handleLogoutSuccess()
				}
			})}
		>
			<Button type="submit" variant="outline" disabled={!!logout.pending}>Ausloggen</Button>
		</form>
	</Dialog.Footer>
</div>
