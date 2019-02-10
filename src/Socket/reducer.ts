import produce from 'immer'
import { SocketState } from './types'

const createReducer = ({
  stateKey = 'socket',
  actionPrefix = 'SOCKET_',
  immer = false
} = {}) => {
  const getStateSlice = (state: any): SocketState => state[stateKey]

  const reducer = (state: any, action: any) => produce(state, (draft: any) => {
    if (draft && !(stateKey in draft)) {
      draft[stateKey] = {
        currentState: 'disconnected',
        desiredState: null,
        lastMessageId: 0,
        outbox: []              
      }
    }
    
    switch(action.type) {
      case actionPrefix + 'MESSAGE_SENT':
        const stateSlice = getStateSlice(draft)
        stateSlice.outbox.splice(
          stateSlice.outbox.findIndex(
            (m: any) => m.id === action.payload),
          1)
        break
        
      case actionPrefix + 'STATE_CHANGE':
        getStateSlice(draft).currentState = action.payload
        break
    }
  })

  // XXX instead of asking the user to tell us whether he's using
  // immer, we should be using isDraft, however this doesn't work at
  // the moment for some reason
  const withImmer = (state: any, worker: any) => immer
    ? worker(state)
    : produce(state, worker)

  const addToOutbox = (state: any, data: any) => withImmer(state, (draft: any) => {
    const stateSlice = getStateSlice(draft)
    stateSlice.lastMessageId += 1
    stateSlice.outbox.push({ id: stateSlice.lastMessageId, data })
  })

  const scheduleConnect = (state: any) => withImmer(state, (draft: any) => {
    getStateSlice(draft).desiredState = 'connected'
  })

  const scheduleDisconnect = (state: any) => withImmer(state, (draft: any) => {
    getStateSlice(draft).desiredState = 'disconnected'
  })
  
  return {
    reducer,
    addToOutbox,
    scheduleConnect,
    scheduleDisconnect
  }
}

export default createReducer
