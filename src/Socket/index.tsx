import findIndex from 'core-js-pure/features/array/find-index'
import createDebug from 'debug'
import React from 'react'
import { connect } from 'react-redux'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { Fragment, withImmer } from '../util'
import {
  SocketConnectionState,
  TrackedSocketMessage,
  SocketMessage,
  SocketState
} from './types'
import OutgoingSocketMessage from './OutgoingSocketMessage'

declare const Primus: any
const debug = createDebug('agent:Socket')

interface PropsFromUser {
  connectionUrl: string
  onMessageReceived(data: SocketMessage): void
}

interface PropsFromState {
  lastMessageId: number // XXX mark as readonly
  desiredState: null | SocketConnectionState
  outbox: TrackedSocketMessage[]
}

interface PropsFromDispatch {
  stateChanged(newConnectionState: SocketConnectionState): void
  messageSent(id: number): void
}

interface DefaultProps {
  mode: 'websocket' | 'primus'
}

type Props = PropsFromUser & PropsFromState & PropsFromDispatch & DefaultProps

class Socket extends React.Component<Props, {}> {
  static defaultProps: DefaultProps = {
    mode: 'websocket'
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
    this.socket.sendJSON(data)
  }

  private messageWasSent(id: number) {
    this.props.messageSent(id)
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
    switch (this.props.mode) {
      case 'websocket':
        this.createWebSocket()
        break

      case 'primus':
        this.createPrimusSocket()
        break
    }
  }

  private createWebSocket() {
    debug('createSocket')
    this.socket = new ReconnectingWebSocket(this.props.connectionUrl)
    this.socket.sendJSON = function(data: any) {
      return this.send(JSON.stringify(data))
    }
    this.socket.addEventListener('open', () => {
      this.props.stateChanged('connected')
    })
    this.socket.addEventListener('close', () => {
      this.props.stateChanged('disconnected')
    })
    this.socket.addEventListener('message', ({ data }: MessageEvent) => {
      if (typeof data !== 'string') {
        throw new Error('Non-string data not yet supported')
      }
      const message = JSON.parse(data)
      this.props.onMessageReceived(message)
    })
  }

  private createPrimusSocket() {
    if (!('Primus' in window)) {
      throw new Error('Primus not available.')
    }

    this.socket = Primus.connect({
      reconnect: {
        strategy: ['disconnect', 'online'], // XXX why?
        max: 20000,
        min: 1000,
        retries: 50
      },
      timeout: 20000 // XXX weird stuff happens when too low and timeout happens
    })

    this.socket.OPEN = Primus.OPEN
    this.socket.CLOSED = Primus.CLOSED
    this.socket.CLOSING = Primus.CLOSING
    this.socket.OPENING = Primus.OPENING
    this.socket.sendJSON = this.socket.write
    this.socket.close = this.socket.end
    this.socket.on('error', (err: any) => {
      debug('primus error code ' + err.code, err)
      if (err.code === 1002) { // cannot connect to server
        // XXX change connection state?
        // XXX dispatch action
        // XXX try retrieving rest resource to ascertain reason
      }
    })
    this.socket.on('incoming::open', () => {
      this.props.stateChanged('connected')
    })
    this.socket.on('close', () => {
      this.props.stateChanged('disconnected')
    })
    this.socket.on('data', (data: any) => {
      this.props.onMessageReceived(data)
    })
  }
}

const createSocketAgent = ({
  stateKey = 'socket',
  actionPrefix = 'SOCKET_'
} = {}) => {
  const getStateSlice = (state: any): SocketState => (state[stateKey] || {})

  /// actions

  const mapStateToProps = (state: any): PropsFromState => ({
    lastMessageId: getStateSlice(state).lastMessageId,
    outbox: getStateSlice(state).outbox,
    desiredState: getStateSlice(state).desiredState
  })

  const mapDispatchToProps = (dispatch: any): PropsFromDispatch => ({
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
