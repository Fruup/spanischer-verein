<script lang="ts">
	import Newsletter from '$lib/components/Newsletter.svelte'

	let { data } = $props()
</script>

<Newsletter
	content={data.newsletter.content}
	title={data.newsletter.title}
	events={data.newsletter.featuredEvents}
/>

{JSON.stringify(data.newsletter)}
