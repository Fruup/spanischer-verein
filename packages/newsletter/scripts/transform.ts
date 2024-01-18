import { join } from 'path'

declare global {
	interface String {
		splice(start: number, delCount: number, newSubStr: string): string
	}
}

String.prototype.splice = function (
	this: string,
	start: number,
	delCount: number,
	newSubStr: string = '',
) {
	return this.slice(0, start) + newSubStr + this.slice(start + delCount)
}

const removeTokens = (text: string, startToken: string, endToken: string) => {
	let start = 0

	while ((start = text.indexOf(startToken)) >= 0) {
		const end = text.indexOf(endToken)
		if (end < 0) break

		text = text.splice(start, end + endToken.length - start)
	}

	return text
}

export const transform = async (text: string, options: { directory?: string } = {}) => {
	text = removeTokens(text, '<script', '</script>')
	text = removeTokens(text, '<!--', '-->')

	const { directory = '.' } = options

	const regexp = () => /<link .*\"(.*\.(?:css|js))\".*>/g
	let match: RegExpExecArray | null

	while ((match = regexp().exec(text))) {
		const index = match.index
		if (typeof index === 'undefined') break

		const [matchedText, path] = match
		if (!path) continue

		// Load replacement text.
		let replacement = ''

		if (path.endsWith('.css')) {
			replacement = `<style>${(await Bun.file(join(directory, path)).text()).trim()}</style>`
		} else if (path.endsWith('.js')) {
			replacement = ''
		}

		text = text.splice(index, matchedText.length, replacement)
	}

	return text
}
