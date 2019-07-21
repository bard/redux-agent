import diff from 'shallow-diff'
import { Store } from 'redux'
import find from './util/find'

export { addTask, delTasks } from './helpers'
export { default as taskReducer } from './reducer'
export { default as reduceReducers } from 'reduce-reducers'
export { default as createHttpAgent } from './agents/http'
export { default as createSocketAgent } from './agents/socket'
export { default as createStorageAgent } from './agents/storage'
export { default as createTimerAgent } from './agents/timer'
export { default as createRngAgent } from './agents/rng'

export const configureAgents = (agents: any[], store: Store) => {
  let currentTasks: { [tid: string]: any } = {}
  const cleanupers: { [tid: string]: any } = {}

  const dispatch = (tid: string) => (action: any) =>
    store.dispatch({
      ...action,
      meta: { ...action.meta, taskId: tid }
    })

  return () => {
    const previousTasks = currentTasks
    // @ts-ignore
    currentTasks = store.getState().tasks
    if (previousTasks !== currentTasks) {

      const { added, deleted } =
        diff(previousTasks, currentTasks)

      added.forEach((tid: string) => {
        const task = currentTasks[tid]
        if (task.type === 'system') {
          return
        }

        const handler = find(agents, (h) => h.type === task.type)
        if (!handler) {
          throw new Error(`No handler for task type "${task.type}"`)
        }

        const cleanup = handler.perform(task, dispatch(tid), handler.config)
        if (cleanup) {
          cleanupers[tid] = cleanup
        }
      })

      deleted.forEach((tid: string) => {
        if (tid in cleanupers) {
          const cleanup = cleanupers[tid]
          delete cleanupers[tid]
          cleanup()
        }
      })
    }
  }
}
