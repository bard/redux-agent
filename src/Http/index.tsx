import createDebug from 'debug'
import { createStandardAction, ActionType, getType } from 'typesafe-actions'
import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import { withImmer, Fragment, findIndex } from '../util'
import FetchHttpRequest from './FetchHttpRequest'
import {
  StateSlice,
  HttpTask,
  HttpTaskState,
  HttpTaskOpts,
  HttpTaskParams
} from './types'

const debug = createDebug('agent:Http')

interface StateProps {
  tasks: any[]
}

interface DispatchProps {
  taskFinished(request: HttpTask,
    state: HttpTaskState,
    result: any): void
}

type Props = StateProps & DispatchProps

class Http extends React.Component<Props, {}> {
  componentDidMount() {
    if (!('fetch' in window)) {
      throw new Error('window.fetch() is not available.')
    }
  }

  render() {
    debug('render')
    if (!this.props.tasks) {
      return null
    }

    const requests = this.props.tasks.map((task) =>
      <FetchHttpRequest id={task.id}
        key={task.id}
        params={task.params}
        onStateChange={(requestState, result) =>
          this.props.taskFinished(task, requestState, result)}
      />
    )

    return <Fragment>{requests}</Fragment>
  }
}

const createHttpAgent = ({
  actionPrefix = 'HTTP_', stateKey = 'http'
} = {}) => {

  // STATE

  const getStateSlice = (state: any): StateSlice => (state[stateKey] || {})

  // ACTIONS

  const actions = {
    taskFinished: createStandardAction(`${actionPrefix}TASK_FINISHED`)<number>()
  }

  // CONNECTED COMPONENT

  const mapStateToProps = (state: any): StateProps => ({
    tasks: getStateSlice(state).tasks
  })

  const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof actions>>): DispatchProps => ({
    taskFinished(task: HttpTask, state, result) {
      dispatch(actions.taskFinished(task.id))

      dispatch({
        type: (state === 'success'
          ? task.opts.success
          : task.opts.failure),
        meta: {
          taskId: task.id,
          taskParams: task.params
        },
        payload: result
      })
    }
  })

  const Component = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Http)

  // REDUCER

  const reducer = (state: any, action: any) => withImmer(state, (draft: any) => {
    if (draft && !(stateKey in draft)) {
      draft[stateKey] = {
        lastTaskId: 0,
        tasks: []
      }
    }

    switch (action.type) {
      case getType(actions.taskFinished):
        const stateSlice = getStateSlice(draft)
        const index = findIndex(stateSlice.tasks,
          (r: HttpTask) => r.id === action.payload)

        stateSlice.tasks.splice(index, 1)
        break
    }
  })

  // SUB-REDUCERS

  const addTask = (
    state: any,
    params: HttpTaskParams,
    opts: HttpTaskOpts
  ) => withImmer(state, (draft: any) => {
    const stateSlice = getStateSlice(draft)
    stateSlice.lastTaskId += 1
    stateSlice.tasks.push({
      id: stateSlice.lastTaskId,
      opts,
      params,
      state: 'queued',
      data: null,
      error: null
    })
  })

  // SELECTORS

  // INTERFACE

  return {
    Component,
    reducer,
    addTask
  }
}

export default createHttpAgent
