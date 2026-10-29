export interface NavigationItem {
	/** Sanity's key for the tree node. Absent on the synthetic "Home" entry. */
	_key?: string
	title: string
	href: string
	children?: NavigationItem[]
}
