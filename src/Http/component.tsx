import createDebug from 'debug'
import React from 'react'
import { connect } from 'react-redux'
import Fragment from '../util/Fragment'
import FetchHttpRequest from './FetchHttpRequest'
import { HttpState,
         TrackedHttpRequest,
         TrackedRequestState } from './types'

const debug = createDebug('reactor:Http')

interface PropsFromUser {
  onRequestStateChange: (request: TrackedHttpRequest) => void
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
  render() {
    debug('render')
    if (!this.props.outbox) {
      return null
    }

    const requests = this.props.outbox.map((request) =>
      <FetchHttpRequest id={request.id}
                        params={request.params}
                        onStateChange={(state, result) =>
                          this.props.requestFinished(request, state, result) }
      />
    )

    return <Fragment>{ requests }</Fragment>
  }
}

export const createHttpReactor = ({
  actionPrefix = 'HTTP_', stateKey = 'http'
} = {}) => {

  const getStateSlice = (state: any): HttpState => (state[stateKey] || {})

  const mapStateToProps = (state: any): PropsFromState => ({
    outbox: getStateSlice(state).outbox
  })

  const mapDispatchToProps = (dispatch: any): PropsFromDispatch => ({
    requestFinished(request: TrackedHttpRequest, state, result) {
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

      dispatch({
        type: actionPrefix + 'REQUEST_FINISHED',
        payload: request.id
      })
    }
  })

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Http)
}
