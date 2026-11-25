import {type BooleanInputProps, useClient} from 'sanity'
import {useEffect, useState} from 'react'
import {Card, Flex} from '@sanity/ui'
import {MAX_HIGHLIGHTED_EVENTS} from './constants'

export default function (props: BooleanInputProps) {
  const numHighlightedEvents = useHighlightedCount()

  const count = (
    <>
      ({numHighlightedEvents}/{MAX_HIGHLIGHTED_EVENTS})
    </>
  )

  const isOk = numHighlightedEvents == null || numHighlightedEvents <= MAX_HIGHLIGHTED_EVENTS
  const tone = isOk ? 'positive' : 'caution'
  const text = isOk
    ? 'Alle hervorgehobenen Events werden auf der Startseite angezeigt, sobald sie in der Vergangenheit liegen.'
    : 'Es sind zu viele Events hervorgehoben. Nicht alle werden auf der Startseite angezeigt.'

  const notice = (
    <Card marginTop={2} padding={3} tone={tone} style={{fontSize: '0.9em'}}>
      <Flex gap={2}>
        <div>{count}</div>
        <div>{text}</div>
      </Flex>
    </Card>
  )

  return (
    <>
      {props.renderDefault(props)}
      {numHighlightedEvents != null && notice}
    </>
  )
}

const HIGHLIGHTED_FILTER = `*[
  _type == "event" &&
  highlighted == true &&
  !(_id in path("drafts.**"))
]`

const HIGHLIGHTED_COUNT_QUERY = `count(${HIGHLIGHTED_FILTER})`

function useHighlightedCount() {
  const client = useClient({apiVersion: '2021-06-07'})
  const [numHighlightedEvents, setNumHighlightedEvents] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    function updateCount() {
      client.fetch<number>(HIGHLIGHTED_COUNT_QUERY).then((count) => {
        if (!cancelled) setNumHighlightedEvents(count)
      })
    }

    updateCount()

    const subscription = client
      .listen(
        HIGHLIGHTED_FILTER,
        {},
        {visibility: 'query', includeResult: false, includePreviousRevision: false},
      )
      .subscribe(() => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(updateCount, 500)
      })

    return () => {
      cancelled = true
      subscription.unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [client])

  return numHighlightedEvents
}
