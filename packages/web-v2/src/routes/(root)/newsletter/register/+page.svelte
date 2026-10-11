<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'

	import Button from '#lib/components/button.svelte'
	import Loader from '#lib/components/icons/loader.svelte'
	import { confirmNewsletterSubscription } from '#lib/mailer/newsletter.remote.js'

	let promise: Promise<unknown> | undefined = $state()

	onMount(() => {
		const email = page.url.searchParams.get('email')
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		if (!email || !emailRegex.test(email)) {
			promise = Promise.reject(new Error('No email provided'))
			return
		}

		promise = confirmNewsletterSubscription(email).then(() => {
			toast.success('Vielen Dank!\nWir fügen Dich gerne zu unserer Liste hinzu 😊', {
				duration: 5000,
			})

			goto('/', { replace: true })
		})
	})
</script>

<div
	class="grid min-h-[20vh] place-content-center text-center [&_*]:mx-auto [&_a]:underline [&_a]:decoration-brand"
>
	{#if promise}
		{#await promise}
			<Loader />
		{:then}
			<p>
				Vielen Dank!<br />
				Wir fügen Dich gerne zu unserer Liste hinzu 😊
			</p>
		{:catch}
			<p>
				Da ist etwas schiefgegangen... 😕<br />
				Versuche es bitte später erneut, oder
				<a href="mailto:info@spanischerverein.com">schreib' uns eine Mail</a>.
			</p>
		{/await}
	{/if}

	<Button href="/">Zurück zur Startseite</Button>
</div>
