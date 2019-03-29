import createDebug from 'debug'
import React from 'react'
import { connect } from 'react-redux'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { Fragment, withImmer, findIndex } from '../util'
import {
  SocketConnectionState,
  TrackedSocketMessage,
  SocketMessage,
  SocketState
} from './types'
import OutgoingSocketMessage from './OutgoingSocketMessage'

const debug = createDebug('agent:Socket')

interface OwnProps {
  connectionUrl: string
  onMessageReceived(data: SocketMessage): void
}

interface StateProps {
  lastMessageId: number // XXX mark as readonly
  desiredState: null | SocketConnectionState
  outbox: TrackedSocketMessage[]
}

interface DispatchProps {
  stateChanged(newConnectionState: SocketConnectionState): void
  messageSent(id: number): void
}

interface DefaultProps {
  socketFactory: (connectionUrl: string) => MinimalWebSocket
  wireFormat: null | 'json'
}

export type MinimalWebSocket = Pick<WebSocket,
  'OPEN' | 'CONNECTING' | 'CLOSING' | 'onopen' | 'onclose' |
  'onmessage' | 'close' | 'send'
>

type Props = OwnProps & StateProps & DispatchProps & DefaultProps

class Socket extends React.Component<Props, {}> {
  static defaultProps: DefaultProps = {
    socketFactory: (connectionUrl: string): MinimalWebSocket =>
      // @ts-ignore
      new ReconnectingWebSocket(connectionUrl),
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
    this.socket = this.props.socketFactory(this.props.connectionUrl)

    this.socket.onopen = () => {
      this.props.stateChanged('connected')
    }

    this.socket.onclose = () => {
      this.props.stateChanged('disconnected')
    }

    this.socket.onmessage = ({ data }: MessageEvent) => {
      this.props.onMessageReceived(this.decode(data))
    }
  }
}

const createSocketAgent = ({
  stateKey = 'socket',
  actionPrefix = 'SOCKET_'
} = {}) => {
  const getStateSlice = (state: any): SocketState => (state[stateKey] || {})

  /// actions

  const mapStateToProps = (state: any): StateProps => ({
    lastMessageId: getStateSlice(state).lastMessageId,
    outbox: getStateSlice(state).outbox,
    desiredState: getStateSlice(state).desiredState
  })

  const mapDispatchToProps = (dispatch: any): DispatchProps => ({
    stateChanged(newConnectionState: SocketConnectionState) {
      dispatch({
        type: actionPrefix + 'STATE_CHANGED',
        payload: newConnectionState
      })
    },

    messageSent(id: number) {
      dispatch({
        type: actionPrefix + 'MESSAGE_SENT',
        payload: id
      })
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
      case actionPrefix + 'MESSAGE_SENT':
        const stateSlice = getStateSlice(draft)
        const index = findIndex(
          stateSlice.outbox,
          (m: any) => m.id === action.payload
        )

        stateSlice.outbox.splice(index, 1)
        break

      case actionPrefix + 'STATE_CHANGE':
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
