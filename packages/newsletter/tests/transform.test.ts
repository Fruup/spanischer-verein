import { transform } from '../scripts/transform'

const main = async () => {
	console.log(await transform('<link src="files/test.css">'))
	console.log(await transform('<link src="files/test.js">'))
	console.log(await transform('<link src="files/test.css">\n<link src="files/test.js">'))
}

main()
