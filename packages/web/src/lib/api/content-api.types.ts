import type { PortableTextBlock } from '@portabletext/types'

export interface IContentApi {
	getEventsOverview(options: { year: number; month: number }): Promise<ContentApi.Event[]>
	getCurrentEventsOverview(
		pageIndex: number,
	): Promise<{ events: ContentApi.Event[]; hasMore: boolean }>
	getPastHighlights(): Promise<ContentApi.Event[]>
	getEvent(slug: string): Promise<(ContentApi.Event & { content: ContentApi.Content }) | null>
	getNavigationTree(): Promise<ContentApi.NavigationItem[]>
	getPage(path: string[]): Promise<ContentApi.Page | null>
	getSiteSettings(): Promise<ContentApi.SiteSettings | null>
	getSitemapDocuments(): Promise<{
		events: { slug: string; updatedAt: string }[]
		pages: { slug: string; updatedAt: string }[]
	}>
}

type TipTapContent = any // TODO: JSONContent?
type SanityContent = PortableTextBlock[]

export namespace ContentApi {
	export type Content =
		| { type: 'sanity'; value: SanityContent }
		| {
				type: 'tiptap'
				value: TipTapContent
		  }

	export interface Image {
		url: string
		prominentColor: string
		height: number
		width: number
	}

	export interface NavigationItem {
		_key: string
		title: string
		href: string
		children?: NavigationItem[]
	}

	export interface SiteSettings {
		donationLink?: string
		imprintPageSlug?: string
		privacyPageSlug?: string
		headerImages?: Image[]
		logo?: Image
	}

	export interface Event {
		title: string
		slug: string
		eventTime: string // ISO timestamp
		eventLocation?: string
		eventAdmission?: string
		mainImage?: Image
	}

	export interface Page {
		title: string
		content: Content
	}
}
