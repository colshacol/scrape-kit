import compose from 'just-compose'

import { IGNORED_HOSTS, GOOGLE_ANCHOR_SELECTOR } from '../consts'
import * as socket from '../socket'

// Ensure that hrefs do not have file extensions.
const removeHrefsWithFileExtensions = (hrefs) => {
  return hrefs.filter((href) => {
    return !href.match(/(\/).+?\.([a-z0-9]{0,4})?$/)
  })
}

// Ensure that no hrefs from restricted hosts get through.
const removeHrefsWithIgnoredHost = (hrefs) => {
  return hrefs.filter((href) => {
    return !IGNORED_HOSTS.some((host) => {
      return href.includes(host)
    })
  })
}

export const filterHrefs = compose(
  removeHrefsWithFileExtensions,
  removeHrefsWithIgnoredHost,
)
