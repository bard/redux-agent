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
    case getType(actions.fetchTodo.intent): {
      addTask(draft, {
        type: 'http',
        method: 'get',
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        actions: {
          success: getType(actions.fetchTodo.success),
          failure: getType(actions.fetchTodo.failure)
        }
      })
      return
    }

    case getType(actions.fetchTodo.success): {
      draft.httpTodoItem = action.payload
      return
    }
  }
})

export default reducer
