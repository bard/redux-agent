import { SystemTask } from './types'

export default <S>(
  state: S,
  action: any
): S => {
  const s = ('tasks' in state)
    ? state
    : {
      ...state,
      tasks: {
        0: {
          type: 'system',
          nextTaskId: 1
        } as SystemTask
      }
    }

  // @ts-ignore
  if (action.meta &&
    action.meta.taskId !== undefined &&
    action.meta.final) {
    const {
      [action.meta.taskId]: removedTask,
      ...remainingTasks
    } =
      // @ts-ignore
      s.tasks

    return {
      ...s,
      tasks: remainingTasks
    }
  } else {
    return s
  }
}
