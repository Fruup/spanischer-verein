declare module '*&imagetools' {
	/**
	 * actual types
	 * - code https://github.com/JonasKruckenberg/imagetools/blob/main/packages/core/src/output-formats.ts
	 * - docs https://github.com/JonasKruckenberg/imagetools/blob/main/docs/guide/getting-started.md#metadata
	 */
	const out
	export default out
}

declare type ValueOf<T> = T[keyof T]

/** See `fontPlugin.ts`: hrefs of the regular, non-italic, Latin-subset file per family. */
declare module 'virtual:fonts-preload' {
	const hrefs: string[]
	export default hrefs
}
