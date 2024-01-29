import {PortableTextBlock, SanityDocument, defineField, defineType, Slug, Image} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

const mainFields = [
  defineField({
    name: 'title',
    title: 'Title',
    group: 'main',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'slug',
    title: 'Slug',
    description:
      'Der Teil der URL, der dieses Event identifiziert. Kann automatisch aus dem Titel generiert werden.',
    group: 'main',
    type: 'slug',
    options: {
      source: 'title',
      maxLength: 96,
    },
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'mainImage',
    title: 'Bild',
    group: 'main',
    type: 'image',
    options: {
      hotspot: true,
    },
  }),
  defineField({
    name: 'body',
    title: 'Inhalt',
    group: 'main',
    type: 'blockContent',
  }),
]

const eventFields = [
  defineField({
    name: 'eventTime',
    title: '🗓️ Zeitpunkt',
    type: 'datetime',
    group: 'event',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'eventLocation',
    title: '📍 Ort',
    initialValue: 'MACHADO\nSeverinsmühlengasse 1\n50678 Köln',
    type: 'text',
    rows: 3,
    group: 'event',
  }),
  defineField({
    name: 'eventAdmission',
    title: '💰 Eintritt',
    initialValue: 'Eintritt frei,\nSpenden sind willkommen',
    type: 'text',
    group: 'event',
    rows: 2,
  }),
]

const publishingFields = [
  defineField({
    name: 'publishedAt',
    title: 'Veröffentlichen am',
    description:
      'Wenn gesetzt, wird dieses Event erst nach dem angegebenen Zeitpunkt auf der Website erscheinen.',
    type: 'datetime',
    group: 'publishing',
  }),
  defineField({
    name: 'showInNewsletter',
    title: 'Im Newsletter versenden',
    description:
      'Wenn aktiviert, wird ein Newsletter versendet, sobald dieser Post veröffentlicht wird.',
    type: 'boolean',
    group: 'publishing',
    initialValue: true,
  }),
]

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'main', title: 'Post', default: true},
    {name: 'event', title: 'Eventinformationen'},
    {name: 'publishing', title: 'Veröffentlichung'},
  ],
  fields: [...mainFields, ...eventFields, ...publishingFields],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
    prepare(selection) {
      return {...selection}
    },
  },
})

export interface EventSchema extends SanityDocument {
  _type: 'event'

  title: string
  slug: Slug
  mainImage?: Image
  body: PortableTextBlock[]

  // Event
  eventTime: Date
  eventLocation?: string
  eventAdmission?: string

  // Publishing
  publishedAt?: Date
  showInNewsletter?: boolean
}
