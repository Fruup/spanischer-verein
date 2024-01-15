import express from 'express'
import cors from 'cors'
import v1 from './src/v1/routes'

const app = express()

app.use(
	cors({
		origin: 'http://localhost:3333',
		credentials: true,
	}),
)

app.use((request, response, next) => {
	console.log(`${new Date().toLocaleTimeString()} - ${request.method} ${request.url}`)
	next()
})

app.get('/', (request, response) => {
	return response.json({ message: 'Hello World' })
})

app.use('/:apiVersion', v1)

app.listen(80, () => {
	console.log('⚡️ Server listening on port 80!')
})
