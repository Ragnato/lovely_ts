import nconf from 'nconf'
import path from 'path'
import { fileURLToPath } from 'url'
import * as config from './config.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

nconf.use('memory')

nconf.argv().env({
  separator: '__',
  parseValues: true,
})

nconf.file({ file: path.join(__dirname, 'config.json') })

export default nconf
