import {defineField, defineType} from 'sanity'
import {CogIcon, MenuIcon} from '@sanity/icons'

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
