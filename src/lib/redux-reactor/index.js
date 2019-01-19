// DEPENDENCIES
// ----------------------------------------------------------------------

import Debug from 'debug'

// UTILITIES
// ----------------------------------------------------------------------

const debug = Debug('reactor:sequence')

// API
// ----------------------------------------------------------------------

export {
  createHttpReactor,
  httpIntentReducer,
  httpIntent
} from './http'

export {
  createReactReactor
} from './react'

export {
  createHashReactor
} from './location'

export const combineReactors = (...reactors) => {
  let reacting = false
  return () => {
    if (!reacting) {
      debug('initiating')
      reacting = true
      reactors.forEach(reactor => {
        reactor.call()
      })
      reacting = false
      debug('terminated')
    }
  }
}
