import {defineType, defineArrayMember} from 'sanity'
import {GenerateIcon} from '@sanity/icons'
import type {PortableTextMarkDefinition} from '@portabletext/types'
// import PostReferenceIcon from '../components/PostReferenceIcon'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        {title: 'Normal', value: 'normal'},
        // {title: 'H1', value: 'h1'},
        {title: 'Überschrift 1', value: 'h2'},
        {title: 'Überschrift 2', value: 'h3'},
        {title: 'Überschrift 3', value: 'h4'},
        // {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          {title: 'Fett', value: 'strong'},
          {title: 'Kursiv', value: 'em'},
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            name: 'link',
            title: 'URL',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
          {
            name: 'internalLink',
            title: 'Interner Link',
            type: 'reference',
            to: [{type: 'event'}, {type: 'page'}],
            icon: GenerateIcon,
          },
        ],
      },
    }),

    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})

export interface InternalLinkMark extends PortableTextMarkDefinition {
  _type: 'internalLink'
  resolvedReference: {
    _type: 'event' | 'page'
    slug: string
  }
}
