import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {presentationTool} from '@sanity/presentation'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Spanischer Verein',

  projectId: '6a1nd7zb',
  dataset: 'production',

  // apiHost: 'http://sanity.local',

  plugins: [
    deskTool(),
    visionTool(),
    presentationTool({
      previewUrl: 'http://localhost:5173',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
