<script lang="ts">
	import { _internal_pop } from '.'

	const item = _internal_pop()

	console.log(JSON.stringify(item), 'item')
</script>

{#if item}
	{@render item.snippet(item.props)}
{/if}
