// DEPENDENCIES
// ----------------------------------------------------------------------

import React from 'react'

import { configureStore } from './store'
import {
  createReactorSequence,
  createHttpReactor,
  createDomReactor } from './intent-reactor'
import App from './App'

// STORE
// ----------------------------------------------------------------------

const initialState = {
  account: null
}

const store = configureStore(initialState)

// REACTORS
// ----------------------------------------------------------------------

const reactorSequence = createReactorSequence(
  createHttpReactor(store),
  createDomReactor(store, <App />, document.getElementById('root')))

store.subscribe(reactorSequence)

// BOOT
// ______________________________________________________________________

store.dispatch({ type: 'INIT' })
