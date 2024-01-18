<script lang="ts">
	import PostPage from '$lib/components/PostPage.svelte'

	export let data
</script>

<svelte:head>
	<title>{data.post.title} - Spanischer Verein Köln</title>
</svelte:head>

<PostPage post={data.post} />
