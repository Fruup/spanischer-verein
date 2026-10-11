<script lang="ts">
	import { page } from '$app/state'

	let code = $derived(page.error?.errorCode)
	let status = $derived(page.status)

	const messages: Record<App.Error['errorCode'], string> = {
		NOT_FOUND: 'Der Inhalt konnte leider nicht gefunden werden... 😢',
		INVALID_PARAMETERS: 'Die Anfrage war fehlerhaft... 😢',
		SEND_EMAIL_FAILED: 'Die E-Mail konnte nicht gesendet werden... 😢',
	}
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
		<h2>Ein unbekannter Fehler ist aufgetreten...</h2>

		{#if page.error?.message}
			<p>{page.error.message}</p>
		{/if}
	{/if}

	<a
		href="/"
		class="mt-4 rounded-sm underline decoration-brand-link decoration-2 underline-offset-4 focus-ring transition-colors hover:text-brand-link"
	>
		Zurück
	</a>
</div>
