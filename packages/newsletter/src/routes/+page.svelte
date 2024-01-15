<script lang="ts">
	import { PUBLIC_POST_JSON } from '$env/static/public'
	import EventPage from '@spanischer-verein/web/src/lib/components/EventPage.svelte'

	if (!PUBLIC_POST_JSON) throw new Error('PUBLIC_POST_JSON is not defined')

	const post = JSON.parse(PUBLIC_POST_JSON)
</script>

<EventPage event={post} />
