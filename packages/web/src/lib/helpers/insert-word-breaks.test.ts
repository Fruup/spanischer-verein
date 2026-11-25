import { test, expect } from 'vitest'
import { insertWordBreaks, wbr } from './insert-word-breaks'

test('insertWordBreaks', () => {
	expect(insertWordBreaks('🎓 Phonetik- und Phonologiekurs für Spanischsprachige 📅')).toEqual(
		`🎓 Phonetik- und Phonologiekurs für Spanischsprachige 📅`,
	)

	expect(insertWordBreaks(`NOCHE DE GUITARRAS LATIN/JAZZ/FLAMENCO mit Maxi, Merlin y To`)).toEqual(
		`NOCHE DE GUITARRAS LATIN/${wbr}JAZZ/${wbr}FLAMENCO mit Maxi, Merlin y To`,
	)
})
