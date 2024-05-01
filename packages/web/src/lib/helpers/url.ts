export const getEventUrl = (slug: string) => `/event/${slug}`

export const parseMonthFromUrl = (params: any) => {
	const year = parseInt(params.year) || new Date().getFullYear()
	const month = parseInt(params.month) || new Date().getMonth() + 1

	return { year, month }
}
