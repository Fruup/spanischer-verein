import {Config, defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from '@sanity/presentation'
import {schemaTypes} from './schemas'
import {MenuIcon} from '@sanity/icons'
import {
  createDeskHierarchy,
  hierarchicalDocumentList,
  hierarchyTree,
} from '@sanity/hierarchical-document-list'
import './assets/global.css'

const DEV = process.env.MODE === 'development'

const shared = {
  name: 'default',
  title: 'Spanischer Verein',

  projectId: '6a1nd7zb',
  dataset: 'production',

  // apiHost: 'http://sanity.local',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Inhalte')
          .items([
            S.documentTypeListItem('event'),

            // S.listItem()
            //   .title('Zukünftige Events')
            //   .icon(CalendarIcon)
            //   .child(S.documentTypeList('event').filter('dateTime(eventTime) > dateTime(now())')),

            // S.documentTypeListItem('location'),

            S.divider(),

            // Page
            S.documentTypeListItem('page'),

            // Page hierarchy
            createDeskHierarchy({
              //prop drill S and context:
              S,
              context,

              //configure plugin

              title: 'Seitenstruktur',
              icon: MenuIcon,

              // The hierarchy will be stored in this document ID 👇
              documentId: 'page-structure',

              // Document types editors should be able to include in the hierarchy
              referenceTo: ['page'],

              // ❓ Optional: provide filters and/or parameters for narrowing which documents can be added
              // referenceOptions: {
              //   filter: 'status in $acceptedStatuses',
              //   filterParams: {
              //     acceptedStatuses: ['published', 'approved'],
              //   },
              // },

              // ❓ Optional: limit the depth of your hierarchies
              maxDepth: 2,

              // ❓ Optional: subarray of referenceTo, when it should not be possible to create new types from all referenceTo types
              // creatableTypes: ['page'],
            }),

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
    hierarchicalDocumentList(),
  ],

  schema: {
    types: [...schemaTypes, hierarchyTree],
  },
} satisfies Partial<Config>

const developmentWorkspace = defineConfig({
  ...shared,

  name: 'development',
  title: 'Development',
  basePath: '/development',

  dataset: 'development',
})

const defaultWorkspace = defineConfig({
  ...shared,

  name: 'default',
  title: 'Spanischer Verein',
  basePath: '/_',
})

const advancedWorkspace = defineConfig({
  ...shared,

  name: 'advanced',
  title: 'Erweitert',
  basePath: '/advanced',

  plugins: [
    ...shared.plugins,
    visionTool(),
    presentationTool({
      previewUrl: 'http://localhost:5173',
    }),
  ],
})

const workspaces = [
  DEV && developmentWorkspace,
  defaultWorkspace,
  advancedWorkspace,
  // ...
].filter((workspace) => !!workspace)

export default workspaces
