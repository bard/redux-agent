import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, compose } from 'redux'

import {
  combineReactors,
  // createHttpReactor,
  createReactReactor,
//  createHashReactor,
  reactionProcessingEnhancer
} from './lib/redux-reactor'

import * as reactions from './reactions'
import reducer from './reducer'

export const configureStore = (initialState = {}) => {
  const middleware = [
    createLogger({ collapsed: () => true })
  ]

  const enhancers = [
    reactionProcessingEnhancer
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

  const reactors = [
//    createHttpReactor(store),
//    createHashReactor(store, reactions.location),
    createReactReactor(store, reactions.react, document.getElementById('root'))
  ]

  const combinedReactors = combineReactors(...reactors)

  store.subscribe(combinedReactors)

  return store
}
