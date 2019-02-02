// DEPENDENCIES
// ----------------------------------------------------------------------

import Debug from 'debug'
import { getIntents } from './intents'

// STATE
// ----------------------------------------------------------------------

const timers = {}

// UTILITIES
// ----------------------------------------------------------------------

const debug = Debug('reactor:timer')

// API
// ----------------------------------------------------------------------

export const createTimerReactor = (store) => {
  let currentState
  return () => {
    let nextState = getIntents(store.getState(), 'timer')
    if (nextState !== currentState) {
      currentState = nextState
      handleStateChange(currentState, store.dispatch)
    }
  }
}

export const timerIntent = (type, interval) => {
  return {
    type: type + '_INTENT',
    meta: {
      id: intentCounter++,
      reactor: 'timer',
      effect: type + '_EFFECT'
    },
    payload: {
      interval
    }
  }
}

// INTERNALS
// ----------------------------------------------------------------------

let intentCounter = 0

// should be const handleStateChange = (changes, dispatch) => {
const handleStateChange = (currentState, dispatch) => {
  debug('responding to state change')

  currentState.forEach(intent => {
    timers[intent.meta.id] = setInterval(() => {
      dispatch({
        type: intent.meta.effect,
        meta: {
          id: intent.meta.id
        }
      })
    }, intent.payload.interval)
  })
}
