import produce from 'immer'
import { SystemTask } from './types'

export default <S>(
  state: S,
  action: any
): S => produce(state, (draft: any) => {
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
