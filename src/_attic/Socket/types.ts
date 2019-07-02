interface JSONObject { [key: string]: JSONValue }
interface JSONArray extends Array<JSONValue> { }
type JSONValue = string | number | boolean | null | JSONObject | JSONArray

export type SocketConnectionState = 'connected' | 'disconnected'

export type MinimalWebSocket = Pick<WebSocket,
  'OPEN' | 'CONNECTING' | 'CLOSING' | 'onopen' | 'onclose' |
  'onmessage' | 'close' | 'send'
>

export interface SocketMessage {
  type: string
  payload: JSONValue
}

export interface TrackedSocketMessage {
  id: number
  data: any
}

export interface SocketState {
  currentState: SocketConnectionState
  desiredState: null | SocketConnectionState
  outbox: TrackedSocketMessage[]
  lastMessageId: number
}

export interface SocketAgentComponentOwnProps {
  connectionUrl: string | null
  onMessageReceived(data: SocketMessage): void
  onConnectionStateChanged?(newState: SocketConnectionState): void
}

export interface SocketAgentComponentDefaultProps {
  socketFactory?: (connectionUrl: string | null) => MinimalWebSocket
  wireFormat?: null | 'json'
}

export interface SocketAgentFactoryArgs {
  actionPrefix: string
  stateKey: string
}

export interface SocketAgentFactoryResult {
  Component: React.ComponentClass<
    SocketAgentComponentDefaultProps &
    SocketAgentComponentOwnProps
  >
  reducer: <AppState>(state: AppState, action: any) => AppState
  addToOutbox: <AppState>(
    state: AppState,
    data: any) => AppState
  scheduleConnect: <AppState>(state: AppState) => AppState
  scheduleDisconnect: <AppState>(state: AppState) => AppState
}
