import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

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
  ],
})

export interface SiteSettingsSchema {
  _type: 'siteSettings'
  donationLink: string
}
