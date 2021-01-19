import {
  addTask, reduceReducers, taskReducer
} from 'redux-agent'

const reducer = (state, action) => {
  switch (action.type) {
    case 'RANDOM_NUMBER':
      return addTask(state, {
        type: 'rng',
        actions: {
          result: 'RANDOM_NUMBER_RESULT'
        }
      })

    case 'RANDOM_NUMBER_RESULT':
      return {
        ...state,
        randomNumber: action.payload
      }

    default:
      return state
  }
}

export default reduceReducers(reducer, taskReducer)
