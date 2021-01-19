import { getType } from 'typesafe-actions'
import produce from 'immer'
import { addTask } from 'redux-agent'
import { State, Action } from '../types'
import * as actions from '../actions'

const reducer = (
  state: State,
  action: Action
): State => produce(state, (draft: State) => {
  switch (action.type) {
    case getType(actions.generateRandomNumber.intent): {
      addTask(draft, {
        type: 'rng',
        actions: {
          result: getType(actions.generateRandomNumber.result)
        }
      })
      return
    }

    case getType(actions.generateRandomNumber.result): {
      draft.randomNumber = action.payload
      return
    }
  }
})

export default reducer
