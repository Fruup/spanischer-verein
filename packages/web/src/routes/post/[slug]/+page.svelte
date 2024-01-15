<script lang="ts">
	import PostPage from '$lib/components/PostPage.svelte'

	export let data
</script>

<PostPage post={data.post} />
