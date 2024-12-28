<script lang="ts">
	import Newsletter from '$lib/components/Newsletter.svelte'

	let { data } = $props()
</script>

<Newsletter newsletter={data.newsletter} />
