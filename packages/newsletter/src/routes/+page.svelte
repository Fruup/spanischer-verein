<script lang="ts">
	import { PUBLIC_POST_JSON } from '$env/static/public'
	import PostPage from '@spanischer-verein/web/src/lib/components/PostPage.svelte'
	import '@spanischer-verein/web/src/lib/styles/globals.scss'

	if (!PUBLIC_POST_JSON) throw new Error('PUBLIC_POST_JSON is not defined')

	const post = JSON.parse(PUBLIC_POST_JSON)
</script>

<div class="page">
	<PostPage {post} />
</div>

<style>
	.page {
		max-width: 768px;
		margin: auto;
	}
</style>
