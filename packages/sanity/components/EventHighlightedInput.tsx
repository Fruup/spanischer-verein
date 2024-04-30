import {BooleanInputProps, SanityClient, useClient} from 'sanity'
import {useToast} from '@sanity/ui'
import {useEffect} from 'react'

const MAX_HIGHLIGHTED_EVENTS = 1

async function bla(options: {
  client: SanityClient
  toast: ReturnType<typeof useToast>
  excludeId: string
}) {
  const {client, toast, excludeId} = options

  const highlightedEvents = await client.fetch<any[]>(
    `*[
			_type == "event" &&
			highlighted == true
		]`,
    {excludeId},
  )

  let count = highlightedEvents.length

  highlightedEvents.forEach(({_id}) => {
    if (
      _id.startsWith('drafts.') &&
      highlightedEvents.some(({_id}) => _id === _id.slice('drafts.'.length))
    ) {
      count--
    }
  })

  console.log({count}, highlightedEvents)
  // console.log(await client.fetch(`*[_type == "event" && highlighted == true]`))

  if (count > MAX_HIGHLIGHTED_EVENTS) {
    toast.push({
      status: 'warning',
      title: 'Zu viele hervorgehobene Events',
      description: `Es können maximal ${MAX_HIGHLIGHTED_EVENTS} Events hervorgehoben werden.`,
      duration: 0,
    })
  }
}

export default function (props: BooleanInputProps) {
  const client = useClient({apiVersion: '2021-06-07'})
  const toast = useToast()

  useEffect(() => {
    const excludeId = window.location.pathname.slice(window.location.pathname.lastIndexOf(';') + 1)
    console.log(excludeId)

    bla({client, toast, excludeId})
  }, [props.value])

  return props.renderDefault(props)
}
