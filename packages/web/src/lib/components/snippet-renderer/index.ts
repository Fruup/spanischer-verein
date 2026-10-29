import type { Snippet } from 'svelte'
import { default as SnippetRendererComponent } from './snippet-renderer.svelte'

export const SnippetRenderer = <TProps, TSnippet extends Snippet<[TProps]>>(
	args: SnippetRendererArgs<TProps, TSnippet>,
) => {
	stack.push(args)
	console.log('pushed', stack)
	return SnippetRendererComponent
}

interface SnippetRendererArgs<
	TProps = any,
	TSnippet extends Snippet<[TProps]> = Snippet<[TProps]>,
> {
	snippet: TSnippet
	props?: TProps
}

const stack = new Array<SnippetRendererArgs>()

export const _internal_pop = () => {
	const item = stack.pop()
	console.log('popped', stack)
	return item
}
