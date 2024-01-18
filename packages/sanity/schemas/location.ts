import {SanityDocument, defineField, defineType} from 'sanity'
// import LocationInput from '../components/LocationInput'

export default defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      description: 'Diese Adresse wird genau so auf der Seite angezeigt.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Ein Link zu der Location. (z. B. auf Google Maps)',
      type: 'url',
      placeholder: 'https://maps.google.com/maps/...',
    }),
    // defineField({
    //   name: 'coordinates',
    //   title: 'Koordinaten',
    //   type: 'geopoint',
    //   components: {
    //     input: LocationInput,
    //   },
    // }),
  ],
})

export interface LocationSchema extends SanityDocument {
  _type: 'location'

  title: string
  address: string
  url?: string
}
