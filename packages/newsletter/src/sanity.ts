import { createClient } from '@sanity/client'

const SANITY_DATASET = import.meta.env.SANITY_DATASET!
if (!SANITY_DATASET) throw new Error('SANITY_DATASET is not set')

const SANITY_API_TOKEN = import.meta.env.SANITY_API_TOKEN
if (!SANITY_API_TOKEN) throw new Error('SANITY_API_TOKEN is not set')

const SANITY_PROJECT_ID = import.meta.env.SANITY_PROJECT_ID!
if (!SANITY_PROJECT_ID) throw new Error('SANITY_PROJECT_ID is not set')

export const client = createClient({
	dataset: SANITY_DATASET,
	apiVersion: 'v2022-03-07',
	token: SANITY_API_TOKEN,
	projectId: SANITY_PROJECT_ID,
	perspective: 'published',
})
