import {TextInput} from '@sanity/ui'
import {FormEventHandler, useEffect, useState} from 'react'

interface Coordinates {
  long: number
  lat: number
}

const getCoordinatesFromMapsUrl = (url: string): Coordinates | null => {
  // const test = `https://www.google.com/maps/place/Deutsch-Spanischer+Kulturkreis+Antonio+Machado/@50.9230468,6.9576779,17z/data=!4m6!3m5!1s0x47bf2449374100e3:0x327fb903f04b5209!8m2!3d50.9235!4d6.9608!16s%2Fg%2F1hc2m622j?entry=ttu`

  const regexp = /@(\d+\.\d+),(\d+\.\d+)/g
  const match = regexp.exec(url)
  if (!match || match[1] || !match[2]) return null

  return {long: parseFloat(match[1]), lat: parseFloat(match[2])}
}

export default () => {
  const [value, setValue] = useState('')
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)

  useEffect(() => {
    setCoordinates(getCoordinatesFromMapsUrl(value))
  }, [value])

  const handleChange: FormEventHandler = (e) => {
    const target = e.target as HTMLInputElement
    setValue(target.value)
  }

  const handleFocus: FormEventHandler = async (e) => {
    setValue(await navigator.clipboard.readText())
  }

  return (
    <>
      <TextInput onChange={handleChange} onFocus={handleFocus} placeholder="Google maps link..." />
      {coordinates && (
        <>
          {coordinates?.long}/{coordinates?.lat}
        </>
      )}
    </>
  )
}
