import createDebug from 'debug'
import React, { Component } from 'react'
import Fragment from '../util/Fragment'
import OutgoingSocketMessage from './OutgoingSocketMessage'
import { SocketConnectionState,
         SocketMessage,
         TrackedSocketMessage,
         SocketState } from './types'

declare const Primus: any

const debug = createDebug('reactor:Socket')

// ----------------------------------------------------------------------

export * from './types'

// ----------------------------------------------------------------------

interface Props {
  desiredState: null | SocketConnectionState
  outbox: TrackedSocketMessage[]
  onStateChange: (newState: SocketConnectionState) => void
  onMessageReceived: (data: any) => void
  onMessageSent: (id: number) => void
}

let primus = null

export default class Socket extends Component<Props, any> {
  primus: any = null

  constructor(props: Props) {
    super(props)
    debug('constructor')
    this.primusDidConnect = this.primusDidConnect.bind(this)
    this.primusDidReceiveData = this.primusDidReceiveData.bind(this)
    this.primusDidDisconnect = this.primusDidDisconnect.bind(this)
    this.primusDidError = this.primusDidError.bind(this)
    this.messageWasSent = this.messageWasSent.bind(this)
  }

  componentDidMount() {
    debug('componentDidMount')

    if (!primus) {
      debug('creating primus instance')
      // This goes here so hot reloads don't affect it.
      // @ts-ignore
      primus = new Primus({
        manual: true,
        reconnect: {
          strategy: [ 'disconnect', 'online' ], // XXX why?
          max: 20000,
          min: 1000,
          retries: 50
        },
        timeout: 20000 // XXX weird stuff happens when too low and timeout happens
      })
    }

    this.primus = primus

    // XXX should be 'open' but on slow connections 'open' seems to
    // happen before 'incoming::open', so before the underlying
    // transport has actually connected
    this.primus.on('incoming::open', this.primusDidConnect)
    this.primus.on('data', this.primusDidReceiveData)
    this.primus.on('end', this.primusDidDisconnect)
    this.primus.on('error', this.primusDidError)
  }

  componentDidUpdate(prevProps: Props) {
    debug('componentDidUpdate')
    // XXX Until https://github.com/primus/primus/issues/708 is fixed,
    // primus must go online only AFTER we're sure the client has a
    // session. Otherwise, going offline then online will cause primus
    // to try to connect of its own accord.

    if (this.props.desiredState !== prevProps.desiredState) {
      if (this.props.desiredState == 'connected' &&
          this.primus.readyState !== Primus['OPEN'] &&
          this.primus.readyState !== Primus['OPENING']) {
        debug('connecting')
        this.primus.open()
      } else if (this.props.desiredState === 'disconnected' &&
                 this.primus.readyState !== Primus['CLOSED']) {
        debug('disconnecting')
        this.primus.end()
      }
    }
  }

  componentWillUnmount() {
    debug('componentWillUnmount')
    this.primus.off('incoming::open', this.primusDidConnect)
    this.primus.off('data', this.primusDidReceiveData)
    this.primus.off('end', this.primusDidDisconnect)
    this.primus.off('error', this.primusDidError)
  }

  render() {
    debug('render')
    //if (!online) exit

    return (
      <Fragment>
      { this.props.outbox.map(message =>
        <OutgoingSocketMessage
          primus={this.primus}
          id={message.id}
          data={message.data}
          onSent={this.messageWasSent}
        />) }
      </Fragment>
    )
  }

  // ----------------------------------------------------------------------

  primusDidError(err: any) {
    debug('primus error code ' + err.code, err)
    if (err.code === 1002) { // cannot connect to server
      // XXX change connection state?
      // XXX dispatch action
      // XXX try retrieving rest resource to ascertain reason
    }
  }

  primusDidConnect() {
    this.props.onStateChange('connected')
  }

  primusDidDisconnect() {
    // XXX might check `primus.online` here
    this.props.onStateChange('disconnected')
  }

  primusDidReceiveData(data: SocketMessage) {
    this.props.onMessageReceived(data)
  }

  messageWasSent(id: number) {
    this.props.onMessageSent(id)
  }
}

// ----------------------------------------------------------------------

export const configureSocketStateTools = (stateKey = 'socket') => {
  const socketReducer = (state: any, action: any) => {
    switch(action.type) {
      case 'SOCKET_MESSAGE_SENT':
        const socketState = state[stateKey]
        const messageId = action.payload
        return ({
          ...state,
          [stateKey]: {
            ...socketState,
            outbox: socketState.outbox.filter((m: any) => m.id !== messageId)
          }
        })
      default:
        return state
    }
  }

  const addToSocketOutbox = (state: any, data: any) => {
    const stateSlice = state[stateKey] as SocketState
    return {
      ...state,
      [stateKey]: {
        ...stateSlice,
        lastMessageId: stateSlice.lastMessageId + 1,
        outbox: [
          ...stateSlice.outbox, {
            id: stateSlice.lastMessageId + 1,
            data
          }
        ]
      }
    }
  }

  return { addToSocketOutbox, socketReducer }
}
