import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'
import {PageSchema} from './page'

export default defineType({
  name: 'siteSettings',
  title: 'Seiteneinstellungen',
  type: 'document',
  groups: [],
  icon: CogIcon,
  fields: [
    defineField({
      name: 'donationLink',
      title: 'Spendenlink',
      type: 'url',
    }),
    defineField({
      name: 'imprintPage',
      title: 'Impressum-Seite',
      type: 'reference',
      to: {
        type: 'page',
      },
    }),
  ],
})

export interface SiteSettingsSchema {
  _type: 'siteSettings'
  donationLink: string
  imprintPage?: PageSchema
}
