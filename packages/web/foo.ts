import {transform} from '../newsletter/scripts/transform'

let text = await Bun.file('build/newsletter/kim-morales-praesentiert-latinika.html').text()

let result = transform(text, {directory: "build/newsletter"})

Bun.write('./out.html', await result)
