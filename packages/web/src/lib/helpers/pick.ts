/**
 * Picks a random item from an array.
 */
export function pick<T extends any[]>(
	array: T,
	excludeIndices?: number[],
): { value: ValueOf<T>; index: number } | null {
	for (let i = 0; i < array.length; i++) {
		const index = Math.floor(Math.random() * array.length)
		const value = array[index]

		if (!excludeIndices?.includes(index)) {
			return {
				value,
				index,
			}
		}
	}

	return null
}
