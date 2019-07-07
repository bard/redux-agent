import { BaseTask, TaskCollection, SystemTask } from './types'
import immer from './util/immer'

const getTasks = (state: any): TaskCollection => {
  if (!('tasks' in state)) {
    throw new Error('State not initialized for Redux Agent. ' +
      'Did you call reduceReducers(..., taskReducer)?')
  }

  return state.tasks
}

export const addTask = <S, T extends BaseTask>(
  state: S,
  task: T
): S => {
  const tasks = getTasks(state)
  const systemTask = tasks[0] as SystemTask
  if (immer && immer.isDraft(state)) {
    systemTask.nextTaskId += 1
    tasks[systemTask.nextTaskId] = task
    return state
  } else {
    const newTasks = {
      ...tasks,
      0: {
        ...systemTask,
        nextTaskId: systemTask.nextTaskId + 1
      },
      [systemTask.nextTaskId]: task
    }
    return {
      ...state,
      tasks: newTasks
    }
  }
}

export const delTasks = <S>(
  state: S,
  taskFilter: (t: BaseTask) => boolean
): S => {
  const tasks = getTasks(state)
  if (immer && immer.isDraft(state)) {
    for (const tid in tasks) {
      if (taskFilter(tasks[tid])) {
        delete tasks[tid]
      }
    }
    return state
  } else {
    let newTasks = tasks
    for (const tid in tasks) {
      if (taskFilter(tasks[tid])) {
        const { [tid]: removedTask, ...remainingTasks } = newTasks
        newTasks = remainingTasks
      }
    }
    return {
      ...state,
      tasks: newTasks
    }
  }
}
