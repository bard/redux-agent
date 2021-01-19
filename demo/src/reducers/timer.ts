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
    case getType(actions.startTimer): {
      addTask(draft, {
        type: 'timer',
        interval: 500,
        actions: {
          tick: getType(actions.tick)
        }
      })
      return
    }

    case getType(actions.tick): {
      draft.timerCounter += 1
      return
    }

    case getType(actions.stopAllTimers): {
      delTasks(draft, (t) => t.type === 'timer')
      return
    }
  }
})

export default reducer
