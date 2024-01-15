<script lang="ts">
	import { PortableText, type PortableTextComponents } from '@portabletext/svelte'
	import type { PostSchema } from '@spanischer-verein/sanity/schemas/post'
	import { fly } from 'svelte/transition'
	import EventInfo from './EventInfo.svelte'
	import ImageBlock from './blocks/ImageBlock.svelte'
	import EventInfoBlock from './blocks/EventInfoBlock.svelte'

	const { post } = $props<{
		post: PostSchema
	}>()

	const components: PortableTextComponents = {
		types: {
			image: ImageBlock,
			eventInfo: EventInfoBlock,
		},
	}
</script>

<div class="post-page" in:fly={{ y: 10 }}>
	<div class="heading-container">
		<h1>
			{post.title}
		</h1>

		<!-- <hr /> -->

		{#if post.eventInfo}
			<EventInfo eventInfo={post.eventInfo} />
		{/if}
	</div>

	<PortableText {components} value={post.body} />

	<div class="page-footer">
		zuletzt geändert am {new Date(post._updatedAt).toLocaleString()}
	</div>
</div>

<style lang="scss">
	.post-page {
		:global {
			> * {
				margin: 2rem 0;
			}

			h1 {
				text-align: center;
			}

			p {
				margin: 2rem 0;
			}

			img {
				margin: 2rem 0;
			}
		}
	}

	.page-footer {
		text-align: end;
		font-size: 0.9rem;
		font-style: italic;
		opacity: 0.8;
	}
</style>
