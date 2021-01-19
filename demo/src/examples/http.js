import {
  addTask, reduceReducers, taskReducer
} from 'redux-agent'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_TODO':
      return addTask(state, {
        type: 'http',
        method: 'get',
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        actions: {
          success: 'FETCH_TODO_SUCCESS',
          failure: 'FETCH_TODO_FAILURE'
        }
      })

    case 'FETCH_TODO_SUCCESS':
      return {
        ...state,
        httpTodoItem: action.payload
      }

    default:
      return state
  }
}

export default reduceReducers(reducer, taskReducer)
