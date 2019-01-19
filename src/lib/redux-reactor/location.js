// DEPENDENCIES
// ----------------------------------------------------------------------

import Debug from 'debug'

// STATE
// ----------------------------------------------------------------------

let hashListener

// UTILITIES
// ----------------------------------------------------------------------

const debug = Debug('reactor:location')

// API
// ----------------------------------------------------------------------

export const createHashReactor = (store, mapStateToWorld) => {
  hashListener = () => {
    debug('got hash change event')
    handleWorldChange(store, window.location.hash.substr(1))
  }

  window.addEventListener('hashchange', hashListener)

  let currentState
  return () => {
    let nextState = store.getState()
    if (nextState !== currentState) {
      currentState = nextState
      handleStateChange(currentState, mapStateToWorld)
    }
  }
}

// INTERNALS
// ----------------------------------------------------------------------

const handleWorldChange = (store, location) => {
  debug('handling world change')

  store.dispatch({
    type: 'hash/CHANGE',
    payload: location
  })
}

const handleStateChange = (state, mapStateToWorld) => {
  debug('responding to state change')
  const effect = mapStateToWorld(state)
  if (shouldRender(effect)) {
    debug('rendering new location', effect)
    render(effect)
  } else {
    debug('output equal to previous, not rendering')
  }
}

const shouldRender = (newLocationValue) => {
  return window.location.hash !== '#' + newLocationValue
}

const render = (location) => {
  debug('initiating render')
  window.removeEventListener('hashchange', hashListener)
  window.location.hash = '#' + location
  setImmediate(() => window.addEventListener('hashchange', hashListener))
}
