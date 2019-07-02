import invariant from 'invariant'
import withImmer from '../util/with-immer'
import { BaseTask, TaskCollection, SystemTask } from './types'

const getTasks = (state: any): TaskCollection => {
  invariant(state.tasks,
    'State not initialized for Redux Agent. ' +
    'Did you call reduceReducers(..., taskReducer)?')
  return state.tasks
}

export const addTask = <S, T extends BaseTask>(
  state: S,
  task: T
): S => withImmer(state, (draft: S) => {
  const tasks = getTasks(draft)
  const systemTask = tasks[0] as SystemTask
  systemTask.nextTaskId += 1
  tasks[systemTask.nextTaskId] = task
})

export const delTasks = <S>(
  state: S,
  taskFilter: (t: BaseTask) => boolean
): S => withImmer(state, (draft: S) => {
  const tasks = getTasks(draft)
  for (const tid in tasks) {
    if (taskFilter(tasks[tid])) {
      delete tasks[tid]
    }
  }
})
