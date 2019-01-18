import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, compose } from 'redux'

import { httpIntentReducer } from './intent-reactor'
import reducer from './reducer'

const processEffectsEnhancer = (createStore) => (
  reducer, initialState, enhancer
) => {
  const processedReducer = (state, action) => {
    const newState = reducer(state, action)
    const effectProcessedState = httpIntentReducer(newState, action)
    return effectProcessedState
  }

  return createStore(processedReducer, initialState, enhancer)
}

export const configureStore = (initialState = {}) => {
  const middleware = [
    createLogger({ collapsed: () => true })
  ]

  const enhancers = [
    processEffectsEnhancer
  ]

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )

  const store = createStore(
    reducer,
    initialState,
    composedEnhancers
  )

  return store
}
