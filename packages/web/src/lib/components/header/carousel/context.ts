import { createContext } from 'svelte'

export const [getCarouselContext, setCarouselContext] = createContext<{
	currentIndex: number
	registerItem: () => number
}>()
