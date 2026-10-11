/**
 * Picks a random item from an array, skipping `excludeIndices`.
 *
 * v1 drew a random index up to `array.length` times and gave up if every draw
 * happened to land on an excluded one, so it returned `null` even when a valid
 * index was available (~25% of the time for a two-item array with one
 * exclusion). This picks from the eligible indices directly instead.
 */
export function pick<T extends any[]>(
	array: T,
	excludeIndices?: number[],
): { value: ValueOf<T>; index: number } | null {
	const candidates = array
		.map((_, index) => index)
		.filter((index) => !excludeIndices?.includes(index))

	if (!candidates.length) return null

	const index = candidates[Math.floor(Math.random() * candidates.length)]

	return { value: array[index], index }
}
