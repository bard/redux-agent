import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import {
  configureAgents,
  createHttpAgent,
  createStorageAgent,
  createSocketAgent,
  createTimerAgent,
  createRngAgent
} from 'redux-agent'
import reducer from './reducers'
import { State } from './types'

export const configureStore = (preloadedState?: State) => {
  const middlewares = []

  if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger({ collapsed: () => true }))
  }

  const enhancer = '__REDUX_DEVTOOLS_EXTENSION__' in window
    ? composeWithDevTools(applyMiddleware(...middlewares))
    : applyMiddleware(...middlewares)

  const store = createStore(
    reducer as any,
    // "as any": https://github.com/reduxjs/redux/issues/2808
    preloadedState as any,
    enhancer)

  store.subscribe(configureAgents([
    createHttpAgent(),
    createStorageAgent(),
    createSocketAgent(),
    createTimerAgent(),
    createRngAgent()
  ], store))

  return store
}
