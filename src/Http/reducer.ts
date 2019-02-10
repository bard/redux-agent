import produce from 'immer'
import { HttpState,
         TrackedHttpRequest,
         TrackedRequestEffects } from './types'

const createReducer = ({
  stateKey = 'http',
  actionPrefix = 'HTTP_',
  immer = false
} = {}) => {
  const getStateSlice = (state: any): HttpState => state[stateKey]

  const reducer = (state: any, action: any) => produce(state, (draft: any) => {
    if (draft && !(stateKey in draft)) {
      draft[stateKey] = {
        lastRequestId: 0,
        outbox: []
      }
    }
    
    switch(action.type) {
      case actionPrefix + 'HTTP_REQUEST_FINISHED':
        const stateSlice = getStateSlice(draft)
        stateSlice.outbox.splice(
          stateSlice.outbox.findIndex(
            (r: TrackedHttpRequest) => r.id === action.payload),
          1)
        break
    }
  })

  // XXX instead of asking the user to tell us whether he's using
  // immer, we should be using isDraft, however this doesn't work at
  // the moment for some reason
  const withImmer = (state: any, worker: any) => immer
    ? worker(state)
    : produce(state, worker)                                                       

  const addToOutbox = (state: any, params: any, effect: TrackedRequestEffects) =>
    withImmer(state, (draft: any) => {
      const stateSlice = getStateSlice(draft)
      stateSlice.lastRequestId += 1
      stateSlice.outbox.push({
        id: stateSlice.lastRequestId,
        effect,
        params,
        state: null,
        data: null,
        error: null
      })
    })

  return {
    reducer,
    addToOutbox
  }
}

export default createReducer
