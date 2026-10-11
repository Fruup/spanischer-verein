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

<div class="flex flex-col items-center justify-center text-center">
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

	<a href="/">Zurück</a>
</div>
