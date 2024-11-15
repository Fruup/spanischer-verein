<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'
	import EventInfo, { type EventInfoSpec } from '../EventInfo.svelte'

	interface Props {
		portableText: CustomBlockComponentProps<EventInfoSpec>;
	}

	let { portableText }: Props = $props();
</script>

<EventInfo eventInfo={portableText.value} />
