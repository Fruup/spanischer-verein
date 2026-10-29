<script lang="ts">
	import Button from '#lib/components/ui/button/button.svelte'
	import * as Dialog from '#lib/components/ui/dialog/index.ts'
	import * as Tooltip from '#lib/components/ui/tooltip/index.ts'
	import { CircleCheckIcon, UserStarIcon } from '@lucide/svelte'

	import { adminLoginState } from './admin-login-state.svelte'
	import AdminLoginLoggedOut from './admin-login-logged-out.svelte'
	import AdminLoginLoggedIn from './admin-login-logged-in.svelte'

	let open = $state(false)
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class="flex items-center gap-2">
		{#snippet child({ props })}
			<Button {...props} variant="ghost">
				<UserStarIcon class="size-4" />

				<span>Admin-Login</span>

				{#if adminLoginState.authenticated}
					<Tooltip.Root>
						<Tooltip.Trigger>
							<CircleCheckIcon class="size-4 text-green-600" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Du bist als Admin eingeloggt</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			</Button>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Title>
			<div class="flex items-center gap-2">
				<UserStarIcon class="size-4" />
				<span>Admin-Login</span>
			</div>
		</Dialog.Title>

		{#if adminLoginState.authenticated}
			<AdminLoginLoggedIn bind:open />
		{:else}
			<AdminLoginLoggedOut bind:open />
		{/if}
	</Dialog.Content>
</Dialog.Root>
