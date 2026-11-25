export const insertWordBreaks = (x: string) => {
	let result = ''
	let last = 0

	const matches = x.matchAll(/(\p{L})([^\p{L}\s])(\p{L})/gu)
	for (const match of matches) {
		const [matchedString, a, b, c] = match

		result += x.slice(last, match.index) + `${a}${b}${wbr}${c}`
		last = match.index + matchedString.length
	}

	result += x.slice(last)
	return result
}

export const wbr = '<wbr />'
