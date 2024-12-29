<script lang="ts">
	interface Props {
		newsletterSubscriptionUrl: string
	}

	let { newsletterSubscriptionUrl }: Props = $props()
</script>

<a
	href={newsletterSubscriptionUrl}
	target="_blank"
	rel="noopener noreferrer"
	class="bg-accent hover:bg-accent/80 cursor-pointer rounded-lg px-2.5 py-2 text-sm text-white"
>
	Melde Dich zum Newsletter an!
</a>
