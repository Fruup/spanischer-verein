import {TextInput, Label, Flex} from '@sanity/ui'
import {useEffect, useState} from 'react'
import crypto from 'simple-crypto-js'
import {SANITY_PATCH_TYPE, StringInputProps} from 'sanity'

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
  const [password, setPassword] = useState(initial.password || '')

  useEffect(() => {
    const value = nc.encrypt({user, password})

    props.onChange({
      type: 'set',
      value,
      path: [],
      patchType: SANITY_PATCH_TYPE,
    })
  }, [user, password])

  return (
    <>
      <Flex direction="column" gap={4} marginTop={4}>
        <Label size={2}>Benutzer/E-Mail</Label>
        <TextInput type="text" value={user} onChange={(e) => setUser(e.currentTarget.value)} />

        <Label size={2}>Passwort</Label>
        <TextInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </Flex>
    </>
  )
}
