import {ImageAsset, defineField, defineType} from 'sanity'
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
      name: 'headerImageLeft',
      title: 'Header-Bild (links)',
      type: 'image',
    }),
    defineField({
      name: 'headerImageRight',
      title: 'Header-Bild (rechts)',
      type: 'image',
    }),
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
  headerImageLeft: ImageAsset
  headerImageRight: ImageAsset
  donationLink: string
  imprintPage?: PageSchema
}
