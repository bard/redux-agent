import produce from 'immer'
import { State, SystemTask } from './types'

export default (
  state: State,
  action: any
): State => produce(state, (draft: State) => {
  if (!draft.tasks) {
    const root: SystemTask = { type: 'system', nextTaskId: 0 }
    draft.tasks = { 0: root }
  }

  // @ts-ignore
  if (action.meta && action.meta.taskId !== undefined && action.meta.final) {
    // @ts-ignore
    delete draft.tasks[action.meta.taskId]
  }
})
