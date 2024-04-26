import {defineType} from 'sanity'
import CredentialsInput from '../components/CredentialsInput'

export default defineType({
  name: 'credentials',
  title: 'Zugangsdaten',
  type: 'string',
  components: {
    input: CredentialsInput,
  },
})
