<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'
	import EventInfo from '../EventInfo.svelte'

	const { portableText } = $props<{
		portableText: CustomBlockComponentProps
	}>()
</script>

<EventInfo eventInfo={portableText.value as any} />
