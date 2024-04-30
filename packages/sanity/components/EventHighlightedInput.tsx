import {BooleanInputProps, useClient} from 'sanity'
import {useEffect, useState} from 'react'
import {Card, Flex} from '@sanity/ui'

export const MAX_HIGHLIGHTED_EVENTS = 6

export default function (props: BooleanInputProps) {
  const numHighlightedEvents = useHighlightedCount()

  const count = (
    <>
      ({numHighlightedEvents}/{MAX_HIGHLIGHTED_EVENTS})
    </>
  )

  const isOk = numHighlightedEvents && numHighlightedEvents <= MAX_HIGHLIGHTED_EVENTS
  const tone = isOk ? 'positive' : 'caution'
  const text = isOk
    ? 'Alle hervorgehobenen Events werden auf der Startseite angezeigt, sobald sie in der Vergangenheit liegen.'
    : 'Es sind zu viele Events hervorgehoben. Nicht alle werden auf der Startseite angezeigt.'

  const notice = numHighlightedEvents ? (
    <Card marginTop={2} padding={3} tone={tone} style={{fontSize: '0.9em'}}>
      <Flex gap={2}>
        <div>{count}</div>
        <div>{text}</div>
      </Flex>
    </Card>
  ) : (
    <></>
  )

  return (
    <>
      {props.renderDefault(props)}
      {notice}
    </>
  )
}

function useHighlightedCount() {
  const client = useClient({apiVersion: '2021-06-07'})
  const [numHighlightedEvents, setNumHighlightedEvents] = useState<number | null>(null)

  const query = `*[
    _type == "event" &&
    highlighted == true &&
    !(_id in path("drafts.**"))
  ]`

  const listener = client.listen<any[]>(
    query,
    {},
    {visibility: 'query', includeResult: false, includePreviousRevision: false},
  )

  let timer: NodeJS.Timeout | null = null

  function updateCount() {
    client.fetch<any[]>(query).then((a) => {
      console.log(a)
      setNumHighlightedEvents(a.length)
    })
  }

  useEffect(() => {
    updateCount()

    const subscription = listener.subscribe(() => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(updateCount, 500)
    })

    return () => {
      subscription.unsubscribe()

      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
  }, [])

  return numHighlightedEvents
}
