import type {PortableTextBlock} from '@portabletext/types'
import {defineField, defineType} from 'sanity'

export default defineType({
  type: 'document',
  name: 'newsletterRecipient',
  title: 'Newsletter-Empfänger',
  fields: [
    defineField({
      name: 'email',
      type: 'email',
      title: 'E-Mail',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'email',
    },
  },
})

export interface Newsletter {
  _type: 'newsletter'
  // _id: string
  // _rev: string
  // _createdAt: string
  // _updatedAt: string
  title: string
  featuredEvents: Event[]
  content: PortableTextBlock[]
  publishedAt?: string
}
