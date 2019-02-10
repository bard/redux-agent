import createDebug from 'debug'
import React from 'react'
import Fragment from '../util/Fragment'
import FetchHttpRequest from './FetchHttpRequest'
import { HttpState,
         TrackedHttpRequest,
         TrackedRequestEffects,
         TrackedRequestState } from './types'

const debug = createDebug('reactor:Http2')

interface Props {
  outbox: any[]
  onRequestStateChange: (request: TrackedHttpRequest) => void
}

export default class Http extends React.Component<Props, any> {
  static defaultProps = {
    actionPrefix: 'SOCKET_'
  }

  static getStateSlice(state: any, stateKey: string = 'http'): HttpState {
    // XXX do runtime check with developer-friendly error message here
    return state[stateKey]
  }
  
  constructor(props: Props) {
    super(props)
    debug('constructor')
    this.requestStateDidChange = this.requestStateDidChange.bind(this)
  }

  componentDidMount() {
    debug('componentDidMount')
  }
  
  render() {
    debug('render')
    if (!this.props.outbox) {
      return null
    }
    
    const requests = this.props.outbox.map((request) =>
      <FetchHttpRequest id={request.id}
                        params={request.params}
                        onStateChange={(state, result) =>
                          this.requestStateDidChange(
                            request.id,
                            request.effect,
                            request.params,
                            state,
                            result)}/>
    )

    return <Fragment>{ requests }</Fragment>
  }

  private requestStateDidChange(id: number,
                                effect: TrackedRequestEffects,
                                params: any,
                                state: TrackedRequestState,
                                result: any) {
    debug('requestStateDidChange')
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

