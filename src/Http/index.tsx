import React, { Component } from 'react'
import Fragment from '../util/Fragment'
import FetchHttpRequest from './FetchHttpRequest'
import { HttpState,
         TrackedHttpRequest,
         TrackedRequestEffects,
         TrackedRequestState } from './types'

// ----------------------------------------------------------------------

export * from './types'

interface Props {
  outbox: any[]
  onRequestStateChange: (request: TrackedHttpRequest) => void
}

export default class Http extends Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.requestStateDidChange = this.requestStateDidChange.bind(this)
  }

  render() {
    const requests = this.props.outbox.map((request) =>
      <FetchHttpRequest id={request.id}
                        params={request.params}
                        onStateChange={(state, result) =>
                          this.requestStateDidChange(
                            request.id,
                            request.effect,
                            request.params,
                            state,
                            result)}/>)

    return <Fragment>{ requests }</Fragment>
  }

  private requestStateDidChange(id: number,
                        effect: TrackedRequestEffects,
                        params: any,
                        state: TrackedRequestState,
                        result: any) {
    this.props.onRequestStateChange({
      id,
      state,
      effect,
      params,
      data: state === 'success' && result,
      error: state === 'failure' && result
    })
  }
}

// ----------------------------------------------------------------------

export const configureHttpStateTools = (stateKey = 'http') => {
  const httpReducer = (state: any, action: any) => {
    switch(action.type) {
      case 'HTTP_REQUEST_FINISHED':
        const stateSlice = state[stateKey] as HttpState
        const requestId = action.payload
        return ({
          ...state,
          [stateKey]: {
            ...stateSlice,
            outbox: stateSlice.outbox.filter(
              (r: TrackedHttpRequest) => r.id !== requestId)
          }
        })
      default:
        return state
    }
  }

  const addToHttpOutbox = (state: any, params: any, effect: TrackedRequestEffects) => {
    const httpState = state[stateKey] as HttpState

    return {
      ...state,
      [stateKey]: {
        ...httpState,
        lastRequestId: httpState.lastRequestId + 1,
        outbox: [
          ...httpState.outbox, {
            id: httpState.lastRequestId + 1,
            effect,
            params
          }
        ]
      }
    }
  }

  return { addToHttpOutbox, httpReducer }
}
