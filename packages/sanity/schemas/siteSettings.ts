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
      // options: {
      //   hotspot: true,
      // },
    }),
    defineField({
      name: 'headerImageRight',
      title: 'Header-Bild (rechts)',
      type: 'image',
      // options: {
      //   hotspot: true,
      // },
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
    defineField({
      name: 'contactEmail',
      title: 'Kontakt-E-Mail',
      type: 'email',
    }),
  ],
})

export interface SiteSettingsSchema {
  _type: 'siteSettings'
  headerImageLeft: ImageAsset
  headerImageRight: ImageAsset
  donationLink: string
  imprintPage?: PageSchema
  contactEmail?: string
}
