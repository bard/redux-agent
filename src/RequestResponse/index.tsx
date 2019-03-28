import React from 'react'
import { createAction, ActionType, getType } from 'typesafe-actions'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { withImmer, findIndex } from '../util'
import Fragment from '../util/Fragment'
import {
  StateSlice,
  TrackedRequest,
  TrackedRequestState,
  TrackedRequestCallbacks,
  FactoryResult,
  FactoryArgs,
} from './types'
import Request from './Request'

const createRequestResponseAgent = <TrackedRequestParams extends {}>(
  { actionPrefix, stateKey, taskHandler }: FactoryArgs<TrackedRequestParams>
): FactoryResult<TrackedRequestParams> => {

  // COMPONENT
  // ----------------------------------------------------------------------

  interface StateProps {
    requests: TrackedRequest[]
  }

  interface DispatchProps {
    requestStateChanged(
      request: TrackedRequest,
      state: TrackedRequestState,
      result: any
    ): void
  }

  type Props = StateProps & DispatchProps

  class RequestResponseAgent
    extends React.Component<Props, {}> {
    render() {
      if (!this.props.requests) {
        return null
      }

      const requests = this.props.requests.map((r) =>
        <Request
          key={r.id}
          id={r.id}
          params={r.params}
          sendRequest={taskHandler}
          onStateChange={this.requestDidChangeState(r)}
        />
      )

      return <Fragment>{requests}</Fragment>
    }

    private requestDidChangeState(r: TrackedRequest) {
      return (requestState: TrackedRequestState, result: any) => {
        this.props.requestStateChanged(r, requestState, result)
      }
    }
  }

  // STATE
  // ----------------------------------------------------------------------

  const getStateSlice = (state: any): StateSlice => (state[stateKey] || {})

  // ACTIONS
  // ----------------------------------------------------------------------

  const actions = {
    requestFinished: createAction(`${actionPrefix}TASK_FINISHED`)
  }

  // CONNECTED COMPONENT
  // ----------------------------------------------------------------------

  const mapStateToProps = (state: any): StateProps => ({
    requests: getStateSlice(state).requests
  })

  const mapDispatchToProps = (
    dispatch: Dispatch<ActionType<typeof actions>>
  ): DispatchProps => ({
    requestStateChanged(r, state, result) {
      dispatch({
        type: actionPrefix + 'TASK_FINISHED',
        payload: r.id
      })

      if (!r.callbacks) {
        return
      }

      dispatch({
        type: state === 'success'
          ? r.callbacks.success
          : r.callbacks.failure,
        payload: result
      })
    }
  })

  const Component = connect(
    mapStateToProps,
    mapDispatchToProps
  )(RequestResponseAgent)

  // REDUCER
  // ----------------------------------------------------------------------

  const reducer = (state: any, action: any) => withImmer(state, (draft: any) => {
    if (draft && !(stateKey in draft)) {
      draft[stateKey] = {
        lastRequestId: 0,
        requests: []
      }
    }

    switch (action.type) {
      case getType(actions.requestFinished):
        const stateSlice = getStateSlice(draft)
        const index = findIndex(stateSlice.requests,
          (r: TrackedRequest) => r.id === action.payload)

        stateSlice.requests.splice(index, 1)
        break
    }
  })

  // SUB-REDUCERS
  // ----------------------------------------------------------------------

  const addTask = <S extends {}>(
    appState: S,
    params: TrackedRequestParams,
    callbacks: TrackedRequestCallbacks,
  ): S => withImmer(appState, (draft: S) => {
    const stateSlice = getStateSlice(draft)
    stateSlice.lastRequestId += 1
    stateSlice.requests.push({
      id: stateSlice.lastRequestId,
      callbacks,
      params,
      requestState: 'queued'
    })
  })

  // AGENT INTERFACE
  // ----------------------------------------------------------------------

  return {
    Component,
    reducer,
    addTask
  }
}

export default createRequestResponseAgent
