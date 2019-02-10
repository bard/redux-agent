import createDebug from 'debug'
import React from 'react'
import Fragment from '../util/Fragment'
import { SocketConnectionState,
         TrackedSocketMessage,
         SocketMessage,
         SocketState } from '../Socket/types'
import OutgoingSocketMessage from '../Socket/OutgoingSocketMessage'

declare const Primus: any

if (!('Primus' in window)) {
// XXX actually check for existence of Primus in window and provide developer-friendly message if it doesn't
  console.error('Primus object not available')
}

const debug = createDebug('reactor:Primus')

interface Props {
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
    this.socket = Primus.connect({
      reconnect: {
        strategy: [ 'disconnect', 'online' ], // XXX why?
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
      this.props.onGlobalAction({
        type: this.props.actionPrefix + 'STATE_CHANGE',
        payload: 'connected'
      })
    })
    this.socket.on('close', () => {
      this.props.onGlobalAction({
        type: this.props.actionPrefix + 'STATE_CHANGE',
        payload: 'disconnected'
      })
    })
    this.socket.on('data', (data: any) => {
      this.props.onMessageReceived(data)
    })
  }
}
