import Bun from 'bun'
import { join } from 'path'
import { transform } from './transform'

function getConfig() {
	return {
		directory: 'build',
		file: 'index.html',
	}
}

async function main() {
	const { directory, file } = getConfig()

	console.log('👨‍💻 Starting single-file processor...')

	try {
		// process.chdir(directory)

		const html = await Bun.file(join(directory, file)).text()
		const transformed = await transform(html, { directory })
		Bun.write(Bun.file(join(directory, file)), transformed)
	} catch (error) {
		console.error("❌ Couldn't transform " + file + ' to a single file. Error:')
		console.error(error)
	}

	console.log('🎉 Done!')
}

main()
