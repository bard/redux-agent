import { createStandardAction, getType } from 'typesafe-actions'
import createDebug from 'debug'
import React from 'react'
import { connect } from 'react-redux'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { Fragment, withImmer, findIndex } from '../util'
import {
  SocketConnectionState,
  TrackedSocketMessage,
  MinimalWebSocket,
  SocketState,
  SocketAgentComponentDefaultProps,
  SocketAgentComponentOwnProps,
  SocketAgentFactoryArgs,
  SocketAgentFactoryResult
} from './types'
import OutgoingSocketMessage from './OutgoingSocketMessage'

const debug = createDebug('agent:Socket')

interface StateProps {
  lastMessageId: number // XXX mark as readonly
  desiredState: null | SocketConnectionState
  outbox: TrackedSocketMessage[]
}

interface DispatchProps {
  connectionStateChanged(newConnectionState: SocketConnectionState): void
  messageSent(id: number): void
}

type Props = SocketAgentComponentOwnProps &
  SocketAgentComponentDefaultProps &
  StateProps &
  DispatchProps

class Socket extends React.Component<Props, {}> {
  static defaultProps: SocketAgentComponentDefaultProps = {
    socketFactory: (connectionUrl) => {
      // XXX check at runtime for connectionUrl
      // @ts-ignore
      return new ReconnectingWebSocket(connectionUrl) as MinimalWebSocket
    },
    wireFormat: 'json'
  }

  private socket: any = null

  private hotReloading: boolean = false

  constructor(props: Props) {
    super(props)
    debug('constructor')
    this.setupHMR()
  }

  componentDidMount() {
    debug('componentDidMount')
    this.updateConnectionState()
    this.hotReloading = false
  }

  componentWillUnmount() {
    debug('componentWillUnmount')
    if (!this.hotReloading) {
      this.socket.close()
    }
  }

  componentDidUpdate(prevProps: Props) {
    debug('componentDidUpdate')
    if (this.props.desiredState !== prevProps.desiredState) {
      this.updateConnectionState()
    }
  }

  render() {
    const { outbox = [] } = this.props

    return (
      <Fragment>
        {outbox.map((message) =>
          <OutgoingSocketMessage send={this.send.bind(this)}
            key={message.id}
            id={message.id}
            data={message.data}
            onSent={() => this.messageWasSent(message.id)} />
        )}
      </Fragment>
    )
  }

  private send(data: any) {
    this.socket.send(
      this.encode(data))
  }

  private messageWasSent(id: number) {
    this.props.messageSent(id)
  }

  private encode(data: any) {
    if (this.props.wireFormat === 'json') {
      return JSON.stringify(data)
    } else {
      return data
    }
  }

  private decode(data: any) {
    if (this.props.wireFormat === 'json') {
      return JSON.parse(data)
    } else {
      return data
    }
  }

  private setupHMR() {
    if (module.hot) {
      const globalScope = window as any
      debug('adding handlers to persist socket state across hot reloads')
      if (module.hot.accept.length === 1) {
        // It's Parcel
        const hmrSaveId = '__HMR_SAVE_SOCKET'
        module.hot.dispose(() => {
          debug('saving socket before hot reload')
          globalScope[hmrSaveId] = this.socket
          this.hotReloading = true
        })

        if (globalScope[hmrSaveId]) {
          debug('restoring socket after hot reload')
          this.hotReloading = true
          this.socket = globalScope[hmrSaveId]
          delete globalScope[hmrSaveId]
        }
      } else if (module.hot.accept.length === 2) {
        // It's WebPack
        // tslint:disable-next-line
        console.warn('WebPack HMR currently not supported.')
      }
    }
  }

  private updateConnectionState() {
    const { desiredState } = this.props
    if (!desiredState) {
      return
    }

    debug('updateConnectionState')

    const currentState = this.socket && this.socket.readyState === this.socket.OPEN
      ? 'connected'
      : 'disconnected'
    if (currentState !== desiredState) {
      debug('updating socket', { currentState, desiredState })
      if (desiredState === 'disconnected') {
        this.socket.close()
      } else {
        this.createSocket()
      }
    }
  }

  private createSocket() {
    this.socket = this.props.socketFactory!(this.props.connectionUrl)

    this.socket.onopen = () => {
      this.props.connectionStateChanged('connected')
      if (this.props.onConnectionStateChanged) {
        this.props.onConnectionStateChanged('connected')
      }
    }

    this.socket.onclose = () => {
      this.props.connectionStateChanged('disconnected')
      if (this.props.onConnectionStateChanged) {
        this.props.onConnectionStateChanged('disconnected')
      }
    }

    this.socket.onmessage = ({ data }: MessageEvent) => {
      this.props.onMessageReceived(this.decode(data))
    }
  }
}

const createSocketAgent = (
  factoryArgs?: SocketAgentFactoryArgs
): SocketAgentFactoryResult => {

  const actionPrefix = factoryArgs
    ? factoryArgs.actionPrefix || 'SOCKET_'
    : 'SOCKET_'

  const stateKey = factoryArgs
    ? factoryArgs.stateKey || 'socket'
    : 'socket'

  const getStateSlice = (state: any): SocketState => (state[stateKey] || {})

  /// actions

  const actions = {
    connectionStateChanged: createStandardAction(
      `${actionPrefix}CONNECTION_STATE_CHANGED`
    )<SocketConnectionState>(),

    messageSent: createStandardAction(
      `${actionPrefix}MESSAGE_SENT`
    )<number>()
  }

  /// connected component

  const mapStateToProps = (state: any): StateProps => ({
    lastMessageId: getStateSlice(state).lastMessageId,
    outbox: getStateSlice(state).outbox,
    desiredState: getStateSlice(state).desiredState
  })

  const mapDispatchToProps = (dispatch: any): DispatchProps => ({
    connectionStateChanged(newConnectionState: SocketConnectionState) {
      dispatch(actions.connectionStateChanged(newConnectionState))
    },

    messageSent(id: number) {
      dispatch(actions.messageSent(id))
    }
  })

  const Component = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Socket)

  /// reducer

  const reducer = (state: any, action: any) => withImmer(state, (draft: any) => {
    if (draft && !(stateKey in draft)) {
      draft[stateKey] = {
        currentState: 'disconnected',
        desiredState: null,
        lastMessageId: 0,
        outbox: []
      }
    }

    switch (action.type) {
      case getType(actions.messageSent):
        const stateSlice = getStateSlice(draft)
        const index = findIndex(
          stateSlice.outbox,
          (m: any) => m.id === action.payload
        )

        stateSlice.outbox.splice(index, 1)
        break

      case getType(actions.connectionStateChanged):
        getStateSlice(draft).currentState = action.payload
        break
    }
  })

  /// sub-reducers

  const addToOutbox = (state: any, data: any) => withImmer(state, (draft: any) => {
    const stateSlice = getStateSlice(draft)
    stateSlice.lastMessageId += 1
    stateSlice.outbox.push({ id: stateSlice.lastMessageId, data })
  })

  const scheduleConnect = (state: any) => withImmer(state, (draft: any) => {
    getStateSlice(draft).desiredState = 'connected'
  })

  const scheduleDisconnect = (state: any) => withImmer(state, (draft: any) => {
    getStateSlice(draft).desiredState = 'disconnected'
  })

  return {
    Component,
    reducer,
    addToOutbox,
    scheduleConnect,
    scheduleDisconnect
  }
}

export default createSocketAgent
export { MinimalWebSocket }
