import { tick } from 'svelte'
import type { Action } from 'svelte/action'

/**
 * Automatically resizes an element to fit its parent.
 */
export const fitParent: Action<HTMLElement, { strategy?: 'fontSize' | 'boxSize' | 'scale' }> = (
	node,
	options,
) => {
	document.createElement('style')

	const parent = node.parentElement
	if (!parent) return

	const { strategy = 'scale' } = options

	// create style sheet for this element
	const id = `fit-parent-${createId()}`
	node.classList.add(id)
	const styleSheet = createStyleSheet(id)

	const compute = async () => {
		// reset size
		styleSheet.remove()
		await tick()

		const sx = parent.clientWidth / node.clientWidth
		const sy = parent.clientHeight / node.clientHeight
		const scale = Math.min(sx, sy)

		if (scale >= 1) return

		if (strategy === 'scale') {
			styleSheet.css = `
				scale: ${scale};
				transform-origin: center;
			`
		} else if (strategy === 'boxSize') {
			styleSheet.css = `
				width: ${scale * node.clientWidth}px;
				height: ${scale * node.clientHeight}px;
			`
		} else if (strategy === 'fontSize') {
			const fontSize = Number(getComputedStyle(node).fontSize.slice(0, -2))

			styleSheet.css = `
				font-size: ${fontSize * scale}px;
			`
		}

		styleSheet.append()
	}

	// observe parent resize
	const observer = new ResizeObserver(compute)
	observer.observe(parent)

	// initial compute
	compute()

	return {
		destroy() {
			observer.disconnect()
			styleSheet.remove()
		},
	}
}

const createId = () => Math.floor(0xffffffff * Math.random()).toString(16)

function createStyleSheet(className: string) {
	const style = document.createElement('style')

	return {
		set css(css: string) {
			style.innerHTML = `.${className} { ${css.replaceAll(';', ' !important;')} }`
		},
		append() {
			document.head.appendChild(style)
		},
		remove() {
			style.remove()
		},
	}
}
