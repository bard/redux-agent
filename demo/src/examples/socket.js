import {
  addTask, delTasks, reduceReducers, taskReducer
} from 'redux-agent'

const MAX_EVENTS = 4

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT_WEB_SOCKET':
      return addTask(state, {
        type: 'socket',
        op: 'listen',
        url: 'wss://ws-beta.kraken.com/',
        actions: {
          connect: 'SOCKET_CONNECTED',
          disconnect: 'SOCKET_DISCONNECTED',
          error: 'SOCKET_ERROR',
          message: 'SOCKET_MESSAGE_RECEIVED'
        }
      })

    case 'SUBSCRIBE_TO_CURRENCY_INFO':
      return addTask(state, {
        type: 'socket',
        op: 'send',
        data: {
          event: 'subscribe',
          pair: ['XBT/USD', 'XBT/EUR'],
          subscription: { name: 'ticker' }
        },
        actions: {
          sent: 'SOCKET_MESSAGE_SENT'
        }
      })

    case 'DISCONNECT_WEB_SOCKET':
      return delTasks(state,
        (t) => t.type === 'socket')

    case 'SOCKET_MESSAGE_RECEIVED':
      const { events } = state.liveCurrencyUpdates
      return {
        ...state,
        liveCurrencyUpdates: {
          ...state.liveCurrencyUpdates,
          events: events.length < MAX_EVENTS
            ? events.concat(action.payload)
            : events.slice(0, -1).concat(action.payload)
        }
      }

    default:
      return state
  }
}

export default reduceReducers(reducer, taskReducer)
