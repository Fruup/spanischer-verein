<script lang="ts">
	import Button from '#lib/components/ui/button/button.svelte'
	import * as InputOTP from '#lib/components/ui/input-otp/index.ts'
	import {
		sendLoginOTP as sendLoginOTP_,
		verifyLoginOTP as verifyLoginOTP_,
	} from './admin-login.remote'
	import { OTP_LENGTH, sendLoginOTPSchema, verifyLoginOTPSchema } from './admin-login'
	import Input from '#lib/components/ui/input/input.svelte'
	import { toast } from 'svelte-sonner'
	import { adminLoginState } from './admin-login-state.svelte'
	import type { RemoteFormIssue } from '$app/server'
	import { REGEXP_ONLY_DIGITS } from 'bits-ui'
	import CaptchaWidget from './captcha-widget.svelte'
	import Label from '#lib/components/ui/label/label.svelte'
	import * as Tooltip from '#lib/components/ui/tooltip/index.ts'
	import { InfoIcon } from '@lucide/svelte'

	interface Props {
		open: boolean
	}

	let { open = $bindable() }: Props = $props()

	const verifyLoginOTP = verifyLoginOTP_.for(Date.now())
	const sendLoginOTP = sendLoginOTP_.for(Date.now())

	const loginOtp = (() => {
		let sent = $state(false)

		return {
			get sent() {
				return sent
			},
			get disabled() {
				return !!sendLoginOTP.pending || !captchaWidget?.verified
			},
			send: async () => {
				if (await sendLoginOTP.submit()) {
					sent = true
					sendLoginOTP.element?.reset()
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

	const handleLoginSuccess = () => {
		open = false
		toast.success('Erfolgreich eingeloggt!')
		adminLoginState.update()
	}

	let captchaWidget = $state<CaptchaWidget>()
</script>

<div class="flex flex-col gap-2">
	<CaptchaWidget bind:this={captchaWidget} />

	{#if loginOtp.sent}
		{@const otpProps = verifyLoginOTP.fields.otp.as('text')}

		<div class="flex grow flex-col items-stretch">
			<form
				{...verifyLoginOTP.preflight(verifyLoginOTPSchema).enhance(async (form) => {
					if (await form.submit()) {
						form.element.reset()
						handleLoginSuccess()
					}
				})}
				class="grid w-full grid-cols-[auto_1fr] items-stretch gap-2"
			>
				<div class="mb-1 space-y-1">
					<div class="flex items-center gap-2 pl-1">
						<Label class="text-xs leading-none" for="email">Login-Code</Label>
						{@render _issuesTooltip(verifyLoginOTP.fields.allIssues())}
					</div>

					<p class="pl-1 text-xs leading-tight text-muted-foreground">
						Dir wurde eine E-Mail mit einem Code geschickt. Tippe ihn hier ein, um dich einzuloggen.
					</p>

					<div class="grid w-full grid-cols-[auto_1fr] items-center gap-2">
						<InputOTP.Root maxlength={OTP_LENGTH} {...otpProps} pattern={REGEXP_ONLY_DIGITS}>
							{#snippet children({ cells }: { cells: any[] })}
								<InputOTP.Group>
									{#each cells as cell (cell)}
										<InputOTP.Slot {cell} aria-invalid={otpProps['aria-invalid']} />
									{/each}
								</InputOTP.Group>
							{/snippet}
						</InputOTP.Root>

						<Button type="submit" disabled={!!verifyLoginOTP.pending}>Bestätigen</Button>
					</div>
				</div>
			</form>
		</div>
	{:else}
		<form
			{...sendLoginOTP.preflight(sendLoginOTPSchema).enhance(async () => {
				await loginOtp.send()
			})}
		>
			<div class="mb-1 space-y-1">
				<div class="flex items-center gap-2 pl-1">
					<Label class="text-xs leading-none" for="email">Email</Label>
					{@render _issuesTooltip(sendLoginOTP.fields.allIssues())}
				</div>

				<p class="pl-1 text-xs leading-tight text-muted-foreground">
					Bitte gib deine E-Mail-Adresse ein, um fortzufahren.
				</p>

				<div class="grid w-full grid-cols-[1fr_auto] items-center gap-2">
					<Input id="email" {...sendLoginOTP.fields.email.as('text')} placeholder="Email…" />

					<Button type="submit" disabled={loginOtp.disabled}>Email senden</Button>
				</div>
			</div>
		</form>
	{/if}
</div>

{#snippet _issuesTooltip(issues: RemoteFormIssue[] | undefined)}
	<Tooltip.Root disabled={!issues?.length}>
		<Tooltip.Trigger style="opacity: {!!issues?.length ? 1 : 0}">
			<InfoIcon class="size-4 text-destructive" />
		</Tooltip.Trigger>

		<Tooltip.Content>
			<ul class="text-2xs text-destructive *:my-0 *:list-none">
				{#each issues as issue}
					<li>{issue.path.join('.')}: {issue.message}</li>
				{/each}
			</ul>
		</Tooltip.Content>
	</Tooltip.Root>
{/snippet}
