import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Task, IOTask, State } from './types'

type Handler = React.ComponentType<{
  defaults: any,
  params: any,
  onEvent: any
}>

interface OwnProps {
  handlers: { [type: string]: Handler }
  defaults?: { [type: string]: any }
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
  handlers, defaults
}) => (
    <>{Object.entries(tasks).map(([tid, task]) => {
      if (task.type === 'system') {
        return null
      }

      const HandlerComponent = handlers[task.type]
      if (!HandlerComponent) {
        throw new Error(`No handler for task type "${task.type}"`)
      }

      defaults = defaults || {}

      if ('actions' in task) {
        const ioTask = task as IOTask
        const { type, actions, ...params } = ioTask

        return (
          <HandlerComponent
            key={tid}
            defaults={defaults[type]}
            params={params}
            onEvent={(type: string, payload: any, meta: any) =>
              taskEvent({ id: tid, action: actions[type], payload, meta })} />
        )
      } else {
        const { type, ...params } = task
        return (
          <HandlerComponent
            key={tid}
            defaults={defaults[type]}
            params={params}
            onEvent={() => { }} />
        )
      }
    })}</>
  )

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

