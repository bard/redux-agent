import { reduceReducers } from 'redux-agent'
import { HttpAgent } from './agents'
import { State } from './types'

const reducer = (state: State = { user: null }, action: any): State => {
  switch (action.type) {
    case 'FETCH_USER':
      return HttpAgent.addTask(state, {
        method: 'get', url: 'http://jsonplaceholder.typicode.com/users/1'
      }, { success: 'USER_SUCCESS', failure: 'USER_FAILURE' })

    case 'USER_SUCCESS':
      return {
        ...state,
        user: action.payload
      }

    default:
      return state
  }
}

export default reduceReducers(
  reducer,
  HttpAgent.reducer
)
