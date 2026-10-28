<script lang="ts">
	import Button from '#lib/components/ui/button/button.svelte'
	import * as Dialog from '#lib/components/ui/dialog/index.ts'
	import * as InputOTP from '#lib/components/ui/input-otp/index.ts'
	import * as Tooltip from '#lib/components/ui/tooltip/index.ts'
	import { CircleCheckIcon, InfoIcon, UserStarIcon } from '@lucide/svelte'

	import { sendLoginOTP, verifyLoginOTP } from './admin-login.remote'
	import { OTP_LENGTH, sendLoginOTPSchema, verifyLoginOTPSchema } from './admin-login'
	import Input from '#lib/components/ui/input/input.svelte'
	import { toast } from 'svelte-sonner'
	import { adminLoginState } from './admin-login-state.svelte'

	const loginOtp = (() => {
		let sent = $state(false)
		let ready = $state(true)

		return {
			get sent() {
				return sent
			},
			get disabled() {
				return !ready || !!sendLoginOTP.pending
			},
			send: async () => {
				if (!ready) return

				if (await sendLoginOTP.submit()) {
					sent = true

					ready = false
					setTimeout(() => (ready = true), 5_000)
				}
			},
		}
	})()

	$effect(() => {
		sendLoginOTP.fields.value()
		const timer = setTimeout(() => sendLoginOTP.validate({ preflightOnly: true }), 500)
		return () => clearTimeout(timer)
	})

	$effect(() => {
		verifyLoginOTP.fields.value()
		const timer = setTimeout(() => verifyLoginOTP.validate({ preflightOnly: true }), 500)
		return () => clearTimeout(timer)
	})

	$inspect(sendLoginOTP.fields.email.value(), 'value')
	$inspect(sendLoginOTP.fields.email.issues(), 'issues')

	let open = $state(true)

	const handleLoginSuccess = () => {
		open = false
		toast.success('Erfolgreich eingeloggt!')
		adminLoginState.update()
	}
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

		<div class="space-y-2">
			<p class="text-xs text-muted-foreground">
				Bitte gib deine E-Mail-Adresse ein, um dich einzuloggen. Du erhältst eine E-Mail mit einem
				Code, den du anschließend hier eingeben kannst.
			</p>
		</div>

		<Dialog.Footer>
			{#if loginOtp.sent}
				<div class="flex grow flex-col items-stretch">
					<form
						{...sendLoginOTP.preflight(sendLoginOTPSchema).enhance(async () => {
							await loginOtp.send()
						})}
					>
						<input hidden {...sendLoginOTP.fields.email.as('text')} />

						<Button type="submit" variant="ghost" size="xs" disabled={loginOtp.disabled}>
							Erneut senden
						</Button>
					</form>

					<form
						{...verifyLoginOTP.preflight(verifyLoginOTPSchema).enhance(async (form) => {
							if (await form.submit()) {
								handleLoginSuccess()
							}
						})}
						class="grid w-full grid-cols-[auto_auto_1fr] items-stretch gap-2"
					>
						<InputOTP.Root maxlength={OTP_LENGTH} {...verifyLoginOTP.fields.otp.as('text')}>
							{#snippet children({ cells }: { cells: any[] })}
								<InputOTP.Group>
									{#each cells as cell (cell)}
										<InputOTP.Slot {cell} />
									{/each}
								</InputOTP.Group>
							{/snippet}
						</InputOTP.Root>

						<Tooltip.Root disabled={!verifyLoginOTP.fields.allIssues()?.length}>
							<Tooltip.Trigger
								style="opacity: {!!verifyLoginOTP.fields.allIssues()?.length ? 1 : 0}"
							>
								<InfoIcon class="size-4 text-red-700" />
							</Tooltip.Trigger>

							<Tooltip.Content>
								<ul class="text-2xs text-red-700 *:my-0 *:list-none">
									{#each verifyLoginOTP.fields.allIssues() as issue}
										<li>{issue.path.join('.')}: {issue.message}</li>
									{/each}
								</ul>
							</Tooltip.Content>
						</Tooltip.Root>

						<Button type="submit" disabled={!!verifyLoginOTP.pending}>Bestätigen</Button>
					</form>
				</div>
			{:else}
				<form
					{...sendLoginOTP.preflight(sendLoginOTPSchema).enhance(async () => {
						await loginOtp.send()
					})}
					class="grid w-full grid-cols-[1fr_auto] items-center gap-2"
				>
					<div class="relative">
						<Input {...sendLoginOTP.fields.email.as('text')} placeholder="Email…" />

						{#if !!sendLoginOTP.fields.allIssues()?.length}
							<Tooltip.Root>
								<Tooltip.Trigger class="absolute top-1/2 right-0 -translate-1/2">
									<InfoIcon class="size-4 text-red-700" />
								</Tooltip.Trigger>

								<Tooltip.Content>
									<ul class="text-2xs text-red-700 *:my-0 *:list-none">
										{#each sendLoginOTP.fields.allIssues() as issue}
											<li>
												{#if issue.path.length > 0}
													{issue.path.join('.')}:&nbsp;
												{/if}

												{issue.message}
											</li>
										{/each}
									</ul>
								</Tooltip.Content>
							</Tooltip.Root>
						{/if}
					</div>

					<Button type="submit" disabled={loginOtp.disabled}>E-Mail senden</Button>
				</form>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
