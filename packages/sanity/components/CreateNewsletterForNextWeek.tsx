import {Button, Heading, Text, Stack, Grid, Box, Card} from '@sanity/ui'
import {useEffect, useState} from 'react'
import {useClient, DefaultPreview} from 'sanity'
import type {EventSchema} from '../schemas/event'
import {useRouter} from 'sanity/router'
import {DateTime} from 'luxon'
import uuid from 'uuid4'

export default function () {
  const client = useClient()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState<(EventSchema & {mainImageUrl?: string})[]>([])

  const from = DateTime.now().startOf('week').plus({weeks: 1})
  const to = from.endOf('week')

  useEffect(() => {
    client
      .fetch<typeof events>(
        `*[
          _type == "event" &&
          !(_id in path("drafts.**")) &&
          (
            !defined(eventTime) ||
            (
              dateTime(eventTime) >= dateTime($from) && 
              dateTime(eventTime) <= dateTime($to)
            )
          )
        ]{
          ...,
          "mainImageUrl": mainImage.asset->url,
        }`,
        {
          from: from.toISO(),
          to: to.toISO(),
        },
      )
      .then(setEvents)
  }, [client])

  async function handleClick() {
    setIsLoading(true)

    try {
      const publishedAt = DateTime.now()
        .startOf('week')
        .plus({weeks: 1})
        .set({hour: 9, minute: 0, second: 0, millisecond: 0})

      const newsletter = await client.create({
        _id: `drafts.${uuid()}`,
        _type: 'newsletter',
        publishedAt: publishedAt.toISO(),
        featuredEvents: events.map(({_id}) => ({
          _type: 'reference',
          _ref: _id,
          _key: Math.floor(Math.random() * 12 * 16).toString(16),
        })),
      })

      console.log({newsletter})

      router.navigateIntent('edit', {id: newsletter._id, type: 'newsletter'})
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Grid
      padding={[4, 8]}
      style={{maxWidth: '40rem', margin: 'auto', placeContent: 'center', justifyContent: 'stretch'}}
    >
      <Stack space={4}>
        <Stack space={3}>
          <Heading>Neue Newsletter-Vorlage</Heading>
          <Text size={1} muted>
            Erstelle einen neuen Newsletter mit den Events der nächsten Woche. <br />
            Keine Sorge: Der Newsletter wird nicht sofort gesendet!
          </Text>
        </Stack>

        <Button loading={isLoading} onClick={handleClick}>
          Newsletter-Vorlage erstellen
        </Button>
      </Stack>

      <Stack space={3} marginTop={5}>
        <Heading>Vorgestellte Events</Heading>
        <Text size={1} muted>
          Die folgenden Events werden der Vorlage hinzugefügt:
        </Text>
      </Stack>

      <Stack marginTop={4}>
        {events.length > 0 ? (
          events.map((event) => (
            <DefaultPreview
              key={event._id}
              title={event.title}
              media={event.mainImageUrl && <img src={event.mainImageUrl} alt="" />}
            />
          ))
        ) : (
          <Card tone="caution">
            <Box padding={3}>
              <Text size={1} muted>
                Keine Events für nächste Woche geplant.
              </Text>
            </Box>
          </Card>
        )}
      </Stack>
    </Grid>
  )
}
