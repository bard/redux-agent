import {
  addTask, delTasks, reduceReducers, taskReducer
} from 'redux-agent'

const reducer = (state, action) => {
  switch (action.type) {
    case 'START_TIMER':
      return addTask(state, {
        type: 'timer',
        interval: 500,
        actions: {
          tick: 'TICK'
        }
      })

    case 'TICK':
      return {
        ...state,
        counter: state.counter + 1
      }

    case 'STOP_ALL_TIMERS':
      return delTasks(state,
        (t) => t.type === 'timer')

    default:
      return state
  }
}

export default reduceReducers(reducer, taskReducer)
