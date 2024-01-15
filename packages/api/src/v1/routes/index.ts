import express from 'express'
import * as groq from 'groq-js'

const router = express.Router()

const dataset = null

router.get('/ping', (request, response) => {
	return response.sendStatus(200)
})

// users/me?tag=sanity.studio.users.get-current
router.get('/users/me', (request, response) => {
	return response.json({
		id: 'pUSRoNoXs',
		name: 'Leon Scherer',
		email: 'scherer-leon@web.de',
		profileImage: null,
		role: 'administrator',
		roles: [
			{
				name: 'administrator',
				title: 'Administrator',
				description:
					'Read and write access to all datasets, with full access to all project settings.',
			},
		],
		provider: 'sanity',
	})
})

router.get('/projects/6a1nd7zb/datasets/production/acl', (request, response) => {
	return response.json([
		{
			filter: '_id in path("**")',
			permissions: ['history', 'read', 'update', 'create'],
		},
		{
			filter: '(_id in path("**")) && _id in path("drafts.**")',
			permissions: ['history', 'read', 'update', 'create'],
		},
		{
			filter: '_id in path("*")',
			permissions: ['read'],
		},
	])
})

router.get('/projects/6a1nd7zb/datasets', (request, response) => {
	return response.json([])
})

router.get('/data/query/production', async (request, response) => {
	return response.json([])

	let { query: groqQuery } = request.query
	if (typeof groqQuery !== 'string') return response.status(400).json({ message: 'Invalid query' })

	// Interpolate groq parameters.
	for (const [key, value] of Object.entries(request.query)) {
		if (typeof value !== 'string') continue
		if (!key.startsWith('$')) continue

		groqQuery = groqQuery.replace(key, value)
	}

	// Evaluate the groq query.
	const tree = groq.parse(groqQuery)
	const result = await groq.evaluate(tree, { dataset })

	return response.json(await result.get())
})

router.get('/data/listen/production', async (request, response) => {
	// response
	// 	.setHeader('Cache-Control', 'no-cache')
	// 	.setHeader('Content-Type', 'text/event-stream')
	// 	.setHeader('Connection', 'keep-alive')
	// response.flushHeaders() // flush the headers to establish SSE with client

	const headers = {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
	}

	return response.writeHead(200, headers).end()

	console.log(response.headersSent)

	// response.write('data: ')

	// If client closes connection, stop sending events
	response.on('close', () => {
		response.end()
	})

	// return response.sendStatus(200)
})

export default router
