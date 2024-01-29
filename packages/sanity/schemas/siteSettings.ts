import {defineField, defineType} from 'sanity'
import {CogIcon, MenuIcon} from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Seiteneinstellungen',
  type: 'document',
  groups: [{name: 'navigation', title: 'Navigation', icon: MenuIcon}],
  icon: CogIcon,
  fields: [
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'string',
      group: 'navigation',
    }),
    defineField({
      name: 'donationLink',
      title: 'Spendenlink',
      type: 'url',
    }),
  ],
})
