import invariant from 'invariant'
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { State, Task, IOTask } from './types'

interface TaskHandler {
  type: string
  Component: React.ComponentType<{
    params: any,
    onEvent: any
  }>
  defaults: any
}

interface OwnProps {
  handlers: TaskHandler[]
}

interface StateProps {
  tasks: { [tid: string]: Task }
}

interface DispatchProps {
  taskEvent({ id, payload, action, meta }: {
    id: string,
    action: string,
    payload: any,
    meta?: { final: boolean }
  }): void
}

type Props = OwnProps & StateProps & DispatchProps

const find = <T extends {}>(array: T[], fn: (arg: T) => boolean) => {
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      return array[i]
    }
  }
  return null
}

const Agent: React.FunctionComponent<Props> = ({
  tasks, taskEvent,
  handlers
}) => {
  invariant(tasks,
    'State not initialized for Redux Agent. ' +
    'Did you call reduceReducers(..., taskReducer)?')

  return (
    <>{Object.entries(tasks).map(([tid, task]) => {
      if (task.type === 'system') {
        return null
      }

      const handler = find(handlers, (h) => h.type === task.type)
      if (!handler) {
        throw new Error(`No handler for task type "${task.type}"`)
      }

      if ('actions' in task) {
        const ioTask = task as IOTask
        const { type, actions, ...params } = ioTask

        return (
          <handler.Component
            key={tid}
            params={{ ...handler.defaults, ...params }}
            onEvent={(type: string, payload: any, meta: any) =>
              taskEvent({ id: tid, action: actions[type], payload, meta })} />
        )
      } else {
        const { type, ...params } = task
        return (
          <handler.Component
            key={tid}
            params={{ ...handler.defaults, ...params }}
            onEvent={() => { }} />
        )
      }
    })}</>
  )
}

const mapStateToProps = (state: State): StateProps => ({
  tasks: state.tasks
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  taskEvent({ id, payload, action, meta }) {
    //    dispatch(actions.taskDone(id))

    dispatch({
      meta: { ...meta, taskId: id },
      type: action,
      payload: payload
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Agent)
