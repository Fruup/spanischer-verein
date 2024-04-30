import {Button} from '@sanity/ui'
import {useState} from 'react'
import {EditIcon} from '@sanity/icons'
import {SettingsView} from '@sanity/studio-secrets'
import {SECRETS_NAMESPACE} from '../schemas/siteSettings'

const pluginConfigKeys = [
  {
    key: 'user',
    title: 'Benutzer/E-Mail',
    description: 'Der Benutzer oder die E-Mail-Adresse für den Mailserver.',
  },
  {
    key: 'password',
    title: 'Passwort',
    description: 'Das Passwort für den Mailserver.',
  },
]

export default function () {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <Button onClick={() => setShowSettings(true)} icon={EditIcon} text="Bearbeiten" />

      {showSettings && (
        <SettingsView
          title={'Mailing Zugangsdaten'}
          namespace={SECRETS_NAMESPACE}
          keys={pluginConfigKeys}
          onClose={() => {
            setShowSettings(false)
          }}
        />
      )}
    </>
  )
}
