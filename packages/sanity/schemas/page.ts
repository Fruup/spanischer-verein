import {PortableTextBlock, SanityDocument, defineField, defineType, Slug} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Seite',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'Der Teil der URL, der diese Seite identifiziert. Kann automatisch aus dem Titel generiert werden.',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Inhalt',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      // media: 'mainImage',
    },
    prepare(selection) {
      return {...selection}
    },
  },
})

export interface PageSchema extends SanityDocument {
  _type: 'page'

  title: string
  slug: Slug
  body: PortableTextBlock[]
}
