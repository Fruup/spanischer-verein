import {ImageAsset, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'
import {PageSchema} from './page'
import CredentialsInput from '../components/CredentialsInput'

export const SECRETS_NAMESPACE = 'spanischer-verein' as const

export default defineType({
  name: 'siteSettings',
  title: 'Seiteneinstellungen',
  type: 'document',
  groups: [
    {
      name: 'general',
      title: 'Allgemein',
    },
    {
      name: 'header',
      title: 'Header',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
    {
      name: 'mailing',
      title: 'E-Mails',
    },
  ],
  icon: CogIcon,
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'header',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headerImages',
      title: 'Header-Bilder',
      description:
        'Diese Bilder werden links und rechts im Header der Seite angezeigt. Sie rotieren zufällig durch.',
      type: 'array',
      group: 'header',
      of: [
        {
          type: 'image',
          // options: {
          //   hotspot: true,
          // },
        },
      ],
    }),
    defineField({
      name: 'donationLink',
      title: 'Spendenlink',
      type: 'url',
      group: 'general',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Kontakt-E-Mail',
      description:
        'Die E-Mail-Adresse, an die Nutzerinnen und Nutzer Kontaktanfragen senden können.',
      type: 'email',
      group: ['general', 'mailing'],
    }),
    defineField({
      name: 'newsletterSubscriptionRecipient',
      title: 'Newsletter-Abonnement-Empfänger',
      description: 'E-Mail-Adresse, an die Newsletter-Abonnement-Anfragen gesendet werden.',
      type: 'email',
      group: ['mailing'],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imprintPage',
      title: 'Impressum-Seite',
      type: 'reference',
      to: {
        type: 'page',
      },
      group: 'footer',
    }),
    defineField({
      name: 'privacyPage',
      title: 'Datenschutz-Seite',
      description:
        'Diese Seite muss Nutzerinnen und Nutzern über die Nutzung ihrer Daten beim Anmelden zum Newsletter belehren (DSGVO).',
      type: 'reference',
      to: {
        type: 'page',
      },
      group: ['footer', 'mailing'],
    }),
    defineField({
      name: 'mailingInfo',
      title: 'Mailserver-Einstellungen',
      description:
        'Einstellungen für den Mailserver, der für den Newsletter-Versand verwendet wird.',
      type: 'object',
      group: ['mailing'],
      fields: [
        defineField({
          name: 'host',
          title: 'Mailserver Host',
          type: 'string',
        }),
        defineField({
          name: 'port',
          title: 'Mailserver Port',
          type: 'number',
          initialValue: 587,
        }),
        defineField({
          name: 'credentials',
          title: 'Mailserver Zugangsdaten',
          description: 'Verschlüsselte Zugangsdaten für den Mailserver.',
          type: 'string',
          components: {
            input: CredentialsInput,
          },
        }),
      ],
    }),
  ],
})

export interface SiteSettingsSchema {
  _type: 'siteSettings'
  logo: ImageAsset
  headerImages?: ImageAsset[]
  donationLink?: string
  imprintPage?: PageSchema
  privacyPage?: PageSchema
  contactEmail?: string
  newsletterSubscriptionRecipient?: string
  mailingInfo?: {
    host: string
    port: number
  }
}

export interface SecretsSchema {
  _type: 'pluginSecrets'
  _id: `secrets.${typeof SECRETS_NAMESPACE}`
  secrets: {
    user: string
    password: string
  }
}
