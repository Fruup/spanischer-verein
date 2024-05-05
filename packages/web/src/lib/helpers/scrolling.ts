import { afterNavigate } from '$app/navigation'

export function scrollAfterNavigate() {
	afterNavigate(() => {
		const logo = document.querySelector('#scroll-to-marker')
		logo?.scrollIntoView({ behavior: 'smooth' })
	})
}
