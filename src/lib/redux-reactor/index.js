// DEPENDENCIES
// ----------------------------------------------------------------------

import Debug from 'debug'
import { httpReducer } from './http'

// UTILITIES
// ----------------------------------------------------------------------

const debug = Debug('reactor:sequence')

// API
// ----------------------------------------------------------------------

export {
  createHttpReactor,
  httpIntent
} from './http'

export {
  createReactReactor
} from './react'

export {
  createHashReactor
} from './location'

export const reactionProcessingEnhancer = (createStore) => (reducer, initialState, enhancer) => {
  const processedReducer = (state, action) => {
    const newState = reducer(state, action)
    const effectProcessedState = httpReducer(newState, action)
    return effectProcessedState
  }

  return createStore(processedReducer, initialState, enhancer)
}

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
