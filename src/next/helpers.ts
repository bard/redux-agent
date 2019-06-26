import { Task, SystemTask, State } from './types'

export const addTask = <
  S extends State,
  T extends Task
>(draft: S, task: T) => {
  const systemTask = (draft.tasks[0] as SystemTask)
  systemTask.nextTaskId += 1

  draft.tasks[systemTask.nextTaskId] = task
}

export const delTasks = <
  S extends State
>(draft: S, taskFilter: (t: Task) => boolean) => {
  for (const [tid, task] of Object.entries(draft.tasks)) {
    if (taskFilter(task)) {
      delete draft.tasks[tid]
    }
  }
}

