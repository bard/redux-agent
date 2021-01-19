import { getType } from 'typesafe-actions'
import produce from 'immer'
import { addTask, delTasks } from 'redux-agent'
import { State, Action } from '../types'
import * as actions from '../actions'

const reducer = (
  state: State,
  action: Action
): State => produce(state, (draft: State) => {
  switch (action.type) {
    case getType(actions.connectWebSocket): {
      addTask(draft, {
        type: 'socket',
        op: 'listen',
        url: 'wss://ws-beta.kraken.com/',
        actions: {
          connect: getType(actions.socket.connected),
          disconnect: getType(actions.socket.disconnected),
          error: getType(actions.socket.error),
          message: getType(actions.socket.messageReceived)
        }
      })
      return
    }

    case getType(actions.subscribeToCurrencyInfo): {
      addTask(draft, {
        type: 'socket',
        op: 'send',
        data: {
          event: 'subscribe',
          pair: ['XBT/USD', 'XBT/EUR'],
          subscription: { name: 'ticker' }
        },
        actions: {
          sent: getType(actions.socket.messageSent)
        }
      })
      return
    }

    case getType(actions.disconnectWebSocket): {
      delTasks(draft, (t) => t.type === 'socket')
      return
    }

    case getType(actions.socket.disconnected): {
      draft.liveCurrencyUpdates.active = false
      return
    }

    case getType(actions.socket.connected): {
      draft.liveCurrencyUpdates.active = true
      return
    }

    case getType(actions.socket.messageReceived): {
      if (draft.liveCurrencyUpdates.events.length === 4) {
        draft.liveCurrencyUpdates.events.pop()
      }
      draft.liveCurrencyUpdates.events.unshift(action.payload)
      return
    }
  }
})

export default reducer
