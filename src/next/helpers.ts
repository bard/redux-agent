import invariant from 'invariant'
import { Task, SystemTask } from './types'

export const addTask = <T extends Task>(
  // the 'tasks' state member is added at runtime, we don't want
  // to enforce a type because the developer should not be concerned
  // with how the state object is made to support a task store
  draft: any,
  task: T
) => {
  invariant(draft.tasks,
    'State not initialized for Redux Agent. ' +
    'Did you call reduceReducers(..., taskReducer)?')

  const systemTask = (draft.tasks[0] as SystemTask)
  systemTask.nextTaskId += 1

  draft.tasks[systemTask.nextTaskId] = task
}

export const delTasks = <T extends Task>(
  draft: any,
  taskFilter: (t: T) => boolean
) => {
  for (const tid in draft.tasks) {
    if (taskFilter(draft.tasks[tid])) {
      delete draft.tasks[tid]
    }
  }
}
