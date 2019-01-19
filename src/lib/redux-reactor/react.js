// DEPENDENCIES
// ----------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { ReactReduxContext } from 'react-redux/es/components/Context'
import Debug from 'debug'

// UTILITIES
// ----------------------------------------------------------------------

const debug = Debug('reactor:dom')

// API
// ----------------------------------------------------------------------

export const createReactReactor = (store, reactComponent, domRoot) => {
  let currentState
  return () => {
    let nextState = store.getState()
    if (nextState !== currentState) {
      currentState = nextState
      handleStateChange(store, reactComponent, domRoot)
    }
  }
}

// INTERNALS
// ----------------------------------------------------------------------

const handleStateChange = (store, reactComponent, domRoot) => {
  // We don't use a shouldRender() check here, diff'ing between
  // desired world state (virtualdom) and current world state (DOM) is
  // handled by React.
  render(store, reactComponent, domRoot)
}

const render = (store, reactComponent, domRoot) => {
  debug('rendering')

  const Context = ReactReduxContext
  const contextValue = {
    store,
    storeState: store.getState()
  }

  ReactDOM.render(
    <Context.Provider value={contextValue}>
      {reactComponent}
    </Context.Provider>,
    domRoot)
}
