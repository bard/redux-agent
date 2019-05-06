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
  HttpTaskParams,
  HttpAgentFactoryArgs,
  HttpAgentFactoryResult
} from './types'

const debug = createDebug('agent:Http')

interface StateProps {
  tasks: HttpTask[]
}

interface DispatchProps {
  taskFinished(
    request: HttpTask,
    state: HttpTaskState,
    data: any,
    meta: any): void
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

    return <Fragment>{
      this.props.tasks.map((task) =>
        <FetchHttpRequest
          id={task.id}
          key={task.id}
          params={task.params}
          onStateChange={(taskState, data, meta) =>
            this.props.taskFinished(task, taskState, data, meta)} />
      )
    }</Fragment>
  }
}

const createHttpAgent = (
  factoryArgs?: HttpAgentFactoryArgs
): HttpAgentFactoryResult => {

  const actionPrefix = factoryArgs
    ? factoryArgs.actionPrefix || 'HTTP_'
    : 'HTTP_'

  const stateKey = factoryArgs
    ? factoryArgs.stateKey || 'http'
    : 'http'

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
    taskFinished(task: HttpTask, state, data, meta) {
      dispatch(actions.taskFinished(task.id))

      dispatch({
        type: state === 'success' ? task.opts.success : task.opts.failure,
        meta: {
          taskId: task.id,
          taskParams: task.params,
          ...meta
        },
        payload: data
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
    const task: HttpTask = {
      id: stateSlice.lastTaskId,
      opts,
      params,
      state: 'queued'
    }
    stateSlice.tasks.push(task)
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
