export const MOBILE_MENU_CONTEXT = Symbol('mobileMenu')

export interface MobileMenuContext {
	isExpanded: (id: string) => boolean
	toggle: (id: string) => void
	close: () => void
}
