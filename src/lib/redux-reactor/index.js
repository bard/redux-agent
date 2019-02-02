// DEPENDENCIES
// ----------------------------------------------------------------------

import Debug from 'debug'
import { intentReducer } from './intents'

// UTILITIES
// ----------------------------------------------------------------------

const debug = Debug('reactor:sequence')

// API
// ----------------------------------------------------------------------

export {
  addIntent,
  removeIntent
} from './intents'

export {
  createHttpReactor,
  httpIntent
} from './http'

export {
  createTimerReactor,
  timerIntent
} from './timer'

export {
  createReactReactor
} from './react'

export {
  createHashReactor
} from './location-hash'

export const reactionProcessingEnhancer = (createStore) => (reducer, initialState, enhancer) => {
  const processedReducer = (state, action) => {
    const newState = reducer(state, action)
    const effectProcessedState = intentReducer(newState, action)
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
