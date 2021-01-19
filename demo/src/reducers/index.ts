import { reduceReducers, taskReducer } from 'redux-agent'
import { State } from 'types'
import httpDemoReducer from './http'
import timerDemoReducer from './timer'
import rngDemoReducer from './rng'
import websocketDemoReducer from './websocket'

const initialState: State = {
  httpTodoItem: null,
  timerCounter: 0,
  randomNumber: null,
  liveCurrencyUpdates: {
    active: false,
    events: []
  }
}

const reducer = reduceReducers(
  // @ts-ignore
  initialState,
  httpDemoReducer,
  timerDemoReducer,
  rngDemoReducer,
  websocketDemoReducer,
  taskReducer
)

export default reducer
