
type WebSocketLike = Pick<
  WebSocket,
  | 'OPEN' | 'CONNECTING' | 'CLOSING'
  | 'onopen' | 'onclose' | 'onerror' | 'onmessage'
  | 'close' | 'send'
>

interface Config {
  socketFactory?: (url?: string) => WebSocketLike
  encode: (data: any) => any
  decode: (data: any) => any
}

export default (config?: Config) => {
  const createSocket = config && config.socketFactory
    ? config.socketFactory
    : ((url: string) => new WebSocket(url))

  const encoder = config && config.encode
    ? config.encode
    : JSON.stringify

  const decoder = config && config.decode
    ? config.decode
    : JSON.parse

  let socket: WebSocketLike | null = null

  const perform = (params: any, dispatch: any) => {
    const initializeSocket = !socket
    const { actions } = params

    if (initializeSocket) {
      const { url } = params

      socket = createSocket(url)

      socket.onopen = () => {
        dispatch({
          type: actions.connect
        })
      }

      socket.onerror = (err) => {
        dispatch({
          type: actions.error,
          meta: { err }
        })
      }

      socket.onclose = () => {
        dispatch({
          type: actions.disconnect,
          meta: { final: true }
        })
      }

      socket.onmessage = ({ data }: MessageEvent) => {
        dispatch({
          type: actions.message,
          payload: decoder(data)
        })
      }
    }

    const { op } = params
    if (op === 'listen') {
      // do nothing
    }

    if (op === 'send') {
      // if socket connected, otherwise schedule for later
      socket!.send(encoder(params.data))
      dispatch({
        type: actions.sent,
        meta: { final: true }
      })
    }

    if (initializeSocket) {
      return function cleanup() {
        socket!.close()
        socket = null
      }
    }
  }

  return {
    perform,
    type: 'socket'
  }
}
