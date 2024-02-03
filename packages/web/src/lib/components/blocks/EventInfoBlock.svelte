<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'
	import EventInfo from '../EventInfo.svelte'

	export let portableText: CustomBlockComponentProps
</script>

<EventInfo eventInfo={portableText.value} />
