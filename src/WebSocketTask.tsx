import React, { useEffect } from 'react'

interface OwnProps {
  params: any
  onEvent(
    type: 'connect' | 'disconnect' | 'message' | 'error' | 'sent',
    data?: any,
    meta?: {
      err?: any
      final: boolean
    }): void
}

type Props = OwnProps

let socket: WebSocket | null = null

const WebSocketTask: React.FunctionComponent<Props> = ({
  params, onEvent
}) => {
  useEffect(() => {
    const initializeSocket = !socket
    if (initializeSocket) {
      const { url } = params

      socket = new WebSocket(url)

      socket.onopen = () => {
        onEvent('connect')
      }

      socket.onerror = () => {
        onEvent('error')
      }

      socket.onclose = () => {
        onEvent('disconnect')
      }

      socket.onmessage = ({ data }: MessageEvent) => {
        onEvent('message', JSON.parse(data))
      }
    }

    const { op } = params
    if (op === 'listen') {
      // do nothing
    }

    if (op === 'send') {
      // if socket connected, otherwise schedule for later
      socket!.send(JSON.stringify(params.data))
      onEvent('sent', null, { final: true })
    }

    if (initializeSocket) {
      return function cleanup() {
        socket!.close()
        socket = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default {
  type: 'socket',
  Component: WebSocketTask,
  defaults: {}
}
