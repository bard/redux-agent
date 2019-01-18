// DEPENDENCIES
// ----------------------------------------------------------------------

import { configureStore } from './store'

// STORE
// ----------------------------------------------------------------------

const initialState = {
  account: null
}

const store = configureStore(initialState)

// BOOT
// ______________________________________________________________________

store.dispatch({ type: 'INIT' })
