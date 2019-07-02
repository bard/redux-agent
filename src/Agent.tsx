import invariant from 'invariant'
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import find from './util/find'
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
            onEvent={(eventType: string, payload: any, meta: any) =>
              taskEvent({ id: tid, action: actions[eventType], payload, meta })} />
        )
      } else {
        const { type, ...params } = task
        return (
          <handler.Component
            key={tid}
            params={{ ...handler.defaults, ...params }}
            onEvent={() => null} />
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
    dispatch({
      meta: { ...meta, taskId: id },
      type: action,
      payload
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Agent)
