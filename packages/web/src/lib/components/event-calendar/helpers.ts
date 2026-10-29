import { getLocalTimeZone, type DateValue, fromDate, isSameDay } from '@internationalized/date'

export interface EventCalendarItem {
	name: string
	url: string
	date: Date
}

export const getEventsForDay = (day: DateValue, events: EventCalendarItem[]): EventCalendarItem[] =>
	events.filter((event) => isSameDay(day, fromDate(event.date, getLocalTimeZone())))
