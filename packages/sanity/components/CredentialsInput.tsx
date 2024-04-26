import {TextInput, Label, Flex, Dialog, Button, Heading, Container, Box} from '@sanity/ui'
import {useEffect, useState} from 'react'
import crypto from 'simple-crypto-js'
import {SANITY_PATCH_TYPE, StringInputProps} from 'sanity'
import {EditIcon} from '@sanity/icons'

export default function CredentialsInput(props: StringInputProps) {
  const secret = process.env.SANITY_STUDIO_MAIL_CREDENTIALS_SECRET
  const nc = new crypto(secret)

  const decryptSafely = (): {user?: string; password?: string} => {
    if (!props.value) return {}

    try {
      return nc.decrypt(props.value) as {user?: string; password?: string}
    } catch (e) {
      return {}
    }
  }

  const initial = decryptSafely()

  const [user, setUser] = useState(initial.user || '')
  const [password, setPassword] = useState('')

  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setPassword(password || '')
    }
  })

  const handleSave = () => {
    const value = nc.encrypt({user, password})

    props.onChange({
      type: 'set',
      value,
      path: [],
      patchType: SANITY_PATCH_TYPE,
    })

    setOpen(false)
  }

  return (
    <Container>
      <Button onClick={() => setOpen(true)} icon={EditIcon} text="Bearbeiten" />

      {isOpen && (
        <Dialog id="credentials-input" animate>
          <Box margin={6}>
            <Flex direction="column" gap={5}>
              <Heading>Zugangsdaten ändern</Heading>

              <Flex direction="column" gap={2}>
                <Label size={2}>Benutzer/E-Mail</Label>
                <TextInput
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.currentTarget.value)}
                />
              </Flex>

              <Flex direction="column" gap={2}>
                <Label size={2}>Passwort</Label>
                <TextInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
              </Flex>

              <Flex direction="row" gap={2}>
                <Button onClick={handleSave} text="Speichern" />
                <Button tone="caution" onClick={() => setOpen(false)} text="Abbruch" />
              </Flex>
            </Flex>
          </Box>
        </Dialog>
      )}
    </Container>
  )
}
