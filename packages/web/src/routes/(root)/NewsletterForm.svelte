<script lang="ts">
	interface Props {
		newsletterSubscriptionUrl: string
	}

	let { newsletterSubscriptionUrl }: Props = $props()
</script>

<a
	href={newsletterSubscriptionUrl}
	onclick={() => sa_event('newsletter_signup')}
	target="_blank"
	rel="noopener noreferrer"
	class="bg-accent hover:bg-accent-300 block cursor-pointer text-balance rounded-lg px-2.5 py-2 text-center text-sm text-white"
>
	Melde Dich zum Newsletter an!
</a>
