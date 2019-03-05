import createDebug from 'debug'
import { createAction, ActionType, getType } from 'typesafe-actions'
import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import { withImmer, Fragment } from '../util'
import FetchHttpRequest from './FetchHttpRequest'
import { StateSlice,
         TrackedHttpRequest,
         TrackedRequestState,
         TrackedRequestEffects } from './types'

const debug = createDebug('reactor:Http')

interface PropsFromUser {
}

interface PropsFromState {
  outbox: any[]
}

interface PropsFromDispatch {
  requestFinished(request: TrackedHttpRequest,
                  state: TrackedRequestState,
                  result: any): void
}

type Props = PropsFromUser & PropsFromState & PropsFromDispatch

class Http extends React.Component<Props, {}> {
  componentDidMount() {
    if (!('fetch' in window)) {
      throw new Error('window.fetch() is not available.')
    }
  }
  
  render() {
    debug('render')
    if (!this.props.outbox) {
      return null
    }

    const requests = this.props.outbox.map((request) =>
      <FetchHttpRequest id={request.id}
                        key={request.id}
                        params={request.params}
                        onStateChange={(state, result) =>
                          this.props.requestFinished(request, state, result) }
      />
    )

    return <Fragment>{ requests }</Fragment>
  }
}

const createHttpReactor = ({
  actionPrefix = 'HTTP_', stateKey = 'http'
} = {}) => {
  const getStateSlice = (state: any): StateSlice => (state[stateKey] || {})

  /// actions

  const actions = {
    requestFinished: createAction(`${actionPrefix}REQUEST_FINISHED`)
  }  
  
  /// connected component
  
  const mapStateToProps = (state: any): PropsFromState => ({
    outbox: getStateSlice(state).outbox
  })

  const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof actions>>): PropsFromDispatch => ({
    requestFinished(request: TrackedHttpRequest, state, result) {
      dispatch({
        type: actionPrefix + 'REQUEST_FINISHED',
        payload: request.id
      })

      dispatch({
        type: (state === 'success'
             ? request.effect.success
             : request.effect.failure),
        meta: {
          requestId: request.id,
          requestParams: request.params
        },
        payload: result
      })
    }
  })

  const Component = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Http)

  /// reducer

  const reducer = (state: any, action: any) => withImmer(state, (draft: any) => {
    if (draft && !(stateKey in draft)) {
      draft[stateKey] = {
        lastRequestId: 0,
        outbox: []
      }
    }
    
    switch(action.type) {
      case getType(actions.requestFinished):
        const stateSlice = getStateSlice(draft)
        stateSlice.outbox.splice(
          stateSlice.outbox.findIndex(
            (r: TrackedHttpRequest) => r.id === action.payload),
          1)
        break
    }
  })

  /// sub-reducers

  const addToOutbox = (state: any, params: any, effect: TrackedRequestEffects) =>
    withImmer(state, (draft: any) => {
      const stateSlice = getStateSlice(draft)
      stateSlice.lastRequestId += 1
      stateSlice.outbox.push({
        id: stateSlice.lastRequestId,
        effect,
        params,
        state: null,
        data: null,
        error: null
      })
    })

  /// selectors

  /// exports
  
  return {
    Component,
    reducer,
    addToOutbox
  }
}

export default createHttpReactor
