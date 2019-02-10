import createDebug from 'debug'
import React from 'react'
import Fragment from '../util/Fragment'
import { SocketConnectionState,
         TrackedSocketMessage,
         SocketMessage,
         SocketState } from './types'
import OutgoingSocketMessage from './OutgoingSocketMessage'

const debug = createDebug('reactor:Socket2')

interface Props {
  connectionUrl: string
  desiredState: null | SocketConnectionState
  outbox: TrackedSocketMessage[]
  actionPrefix: string
  onMessageReceived(data: SocketMessage): void
  onGlobalAction(action: any): void
}

export default class Socket extends React.Component<Props, {}> {  
  static defaultProps = { actionPrefix: 'SOCKET_' }

  static getStateSlice(state: any, stateKey: string = 'socket'): SocketState {
    // XXX do runtime check with developer-friendly error message here
    return state[stateKey]
  }

  private socket: WebSocket = null
  
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
        { outbox.map(message =>
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
    this.props.onGlobalAction({
      type: this.props.actionPrefix + 'MESSAGE_SENT',
      payload: id
    })
  }

  private setupHMR() {
    if (module.hot) {
      debug('adding handlers to persist socket state across hot reloads')
      if (module.hot.accept.length === 1) {
        // It's Parcel
        const hmrSaveId = '__HMR_SAVE_SOCKET'
        module.hot.dispose(() => {
          debug('saving socket before hot reload')
          window[hmrSaveId] = this.socket
          this.hotReloading = true
        })

        if (window[hmrSaveId]) {
          debug('restoring socket after hot reload')
          this.hotReloading = true
          this.socket = window[hmrSaveId]
          delete window[hmrSaveId]
        }
      } else if (module.hot.accept.length === 2) {
        // It's WebPack
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
    this.socket = new WebSocket(this.props.connectionUrl)
    this.socket.close
    this.socket.sendJSON = function(data: any) {
      return this.send(JSON.stringify(data))
    }
    this.socket.addEventListener('open', () => {
      this.props.onGlobalAction({
        type: this.props.actionPrefix + 'STATE_CHANGE',
        payload: 'connected'
      })
    })
    this.socket.addEventListener('close', () => {
      this.props.onGlobalAction({
        type: this.props.actionPrefix + 'STATE_CHANGE',
        payload: 'disconnected'
      })
    })
    this.socket.addEventListener('message', ({ data }: MessageEvent) => {
      if (typeof data !== 'string') {
        throw new Error('Non-string data not yet supported')
      }
      const message = JSON.parse(data)
      this.props.onMessageReceived(message)
    })
  }
}
