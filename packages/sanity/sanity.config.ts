import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {presentationTool} from '@sanity/presentation'
import {schemaTypes} from './schemas'
import {CalendarIcon} from '@sanity/icons'
import Test from './components/Test'

export default defineConfig({
  name: 'default',
  title: 'Spanischer Verein',

  projectId: '6a1nd7zb',
  dataset: 'production',

  // apiHost: 'http://sanity.local',

  plugins: [
    deskTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('event'),
            S.listItem()
              .title('Zukünftige Events')
              .icon(CalendarIcon)
              .child(S.documentTypeList('event').filter('dateTime(eventTime) > dateTime(now())')),
            S.documentTypeListItem('location'),

            S.divider(),

            // Page
            S.documentTypeListItem('page'),

            S.divider(),

            // Site settings
            S.documentTypeListItem('siteSettings').child(
              S.editor()
                .schemaType('siteSettings')
                .documentId('siteSettings')
                .title('Seiteneinstellungen'),
            ),
          ]),
    }),
    visionTool(),
    presentationTool({
      previewUrl: 'http://localhost:5173',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
