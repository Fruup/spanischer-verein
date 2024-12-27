import type {PortableTextBlock} from '@portabletext/types'
import {defineField, defineType, type Slug} from 'sanity'

export default defineType({
  type: 'document',
  name: 'newsletter',
  title: 'Newsletter',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titel',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Der Slug wird für die URL des Newsletters verwendet',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlichen am',
      description: 'Wann der Newsletter gesendet werden soll',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Inhalt',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredEvents',
      title: 'Vorgestellte Events',
      description: 'Die Events, die in diesem Newsletter vorgestellt werden sollen',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'event'}]}],
    }),
  ],
})

export interface NewsletterSchema {
  _type: 'newsletter'
  // _id: string
  // _rev: string
  // _createdAt: string
  // _updatedAt: string
  title: string
  slug: Slug
  featuredEvents: Event[]
  content: PortableTextBlock[]
  publishedAt?: string
}
