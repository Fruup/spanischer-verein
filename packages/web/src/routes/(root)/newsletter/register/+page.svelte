<script lang="ts">
	import { page } from '$app/stores'
	import Loader from '$lib/components/icons/Loader.svelte'
	import { onMount } from 'svelte'
	import Button from '$lib/components/Button.svelte'
	import { goto } from '$app/navigation'
	import toast from 'svelte-french-toast'

	let promise: Promise<any> | undefined

	onMount(() => {
		const email = $page.url.searchParams.get('email')
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		if (!email || !emailRegex.test(email)) {
			promise = Promise.reject('No email provided')
			return
		}

		const params = new URLSearchParams({ email })

		promise = fetch(`/api/v1/newsletter/request?${params}`).then((response) => {
			if (response.ok) {
				toast.success('Vielen Dank!\nWir fügen Dich gerne zu unserer Liste hinzu 😊', {
					duration: 5000,
				})

				goto('/', { replaceState: true })
				return
			}

			throw new Error()
		})
	})
</script>

<div class="page">
	{#if promise}
		{#await promise}
			<Loader />
		{:then value}
			<p>
				Vielen Dank!<br />
				Wir fügen Dich gerne zu unserer Liste hinzu 😊
			</p>
		{:catch error}
			<p>
				Da ist etwas schiefgegangen... 😕<br />
				Versuche es bitte später erneut, oder
				<a href="mailto:info@spanischerverein.com">schreib' uns eine Mail</a>.
			</p>
		{/await}
	{/if}

	<Button href="/">Zurück zur Startseite</Button>
</div>

<style lang="scss">
	@import 'vars';

	a {
		text-decoration: underline;
		text-decoration-color: $color-accent;
	}

	.page {
		display: grid;
		place-content: center;
		text-align: center;
		min-height: 20vh;

		:global(*) {
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
