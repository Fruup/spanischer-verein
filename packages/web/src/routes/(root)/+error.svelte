<script lang="ts">
	import { page } from '$app/state'
	import { t } from '#lib/messages/index.ts'

	let code = $derived(page.error?.errorCode)
	let status = $derived(page.status)

	const messages = $derived<Record<App.Error['errorCode'], string>>({
		NOT_FOUND: t('error_not_found'),
		INVALID_PARAMETERS: t('error_invalid_parameters'),
		SEND_EMAIL_FAILED: t('error_send_email_failed'),
	})
</script>

<div class="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
	<h2>
		{status}
	</h2>

	{#if code}
		<h2>
			{#if messages[code]}
				{messages[code]}
			{:else}
				{code}
			{/if}
		</h2>
	{:else}
		<h2>{t('error_unknown')}</h2>

		{#if page.error?.message}
			<p>{page.error.message}</p>
		{/if}
	{/if}

	<a
		href="/"
		class="mt-4 rounded-sm underline decoration-brand-link decoration-2 underline-offset-4 focus-ring transition-colors hover:text-brand-link"
	>
		{t('back')}
	</a>
</div>
