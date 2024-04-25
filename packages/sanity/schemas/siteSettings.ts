import {ImageAsset, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'
import {PageSchema} from './page'

export default defineType({
  name: 'siteSettings',
  title: 'Seiteneinstellungen',
  type: 'document',
  groups: [
    {
      name: 'general',
      title: 'Allgemein',
    },
    {
      name: 'header',
      title: 'Header',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
  ],
  icon: CogIcon,
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'header',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headerImages',
      title: 'Header-Bilder',
      description:
        'Diese Bilder werden links und rechts im Header der Seite angezeigt. Sie rotieren zufällig durch.',
      type: 'array',
      group: 'header',
      of: [
        {
          type: 'image',
          // options: {
          //   hotspot: true,
          // },
        },
      ],
    }),
    defineField({
      name: 'donationLink',
      title: 'Spendenlink',
      type: 'url',
      group: 'general',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Kontakt-E-Mail',
      type: 'email',
      group: 'general',
    }),
    defineField({
      name: 'imprintPage',
      title: 'Impressum-Seite',
      type: 'reference',
      to: {
        type: 'page',
      },
      group: 'footer',
    }),
  ],
})

export interface SiteSettingsSchema {
  _type: 'siteSettings'
  logo: ImageAsset
  headerImages?: ImageAsset[]
  donationLink?: string
  imprintPage?: PageSchema
  contactEmail?: string
}
