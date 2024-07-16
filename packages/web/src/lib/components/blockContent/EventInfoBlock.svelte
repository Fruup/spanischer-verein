<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'
	import EventInfo, { type EventInfoSpec } from '../EventInfo.svelte'

	export let portableText: CustomBlockComponentProps<EventInfoSpec>
</script>

<EventInfo eventInfo={portableText.value} />
