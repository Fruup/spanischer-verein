import { DateTime } from 'luxon'

export const buildMonth = (offset = 0, now?: DateTime): DateTime[] => {
	now = (now ?? DateTime.now()).plus({ months: offset })

	const start = now.startOf('month').startOf('week')

	let date = start
	const result = []

	for (let i = 0; i < 42; i++) {
		result.push(date)
		date = date.plus({ days: 1 })
	}

	return result
}

export const isItemActive = (item: DateTime, monthIndex: number) =>
	DateTime.now().plus({ month: monthIndex }).month === item.month

export const isEqualDate = (date1: DateTime | Date, date2: DateTime | Date) => {
	date1 = date1 instanceof DateTime ? date1 : DateTime.fromJSDate(date1)
	date2 = date2 instanceof DateTime ? date2 : DateTime.fromJSDate(date2)
	return date1.year === date2.year && date1.month === date2.month && date1.day === date2.day
}

export const isToday = (item: DateTime) => isEqualDate(item, DateTime.now())
