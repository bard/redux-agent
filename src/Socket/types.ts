interface JSONObject { [key: string]: JSONValue }
interface JSONArray extends Array<JSONValue> { }
type JSONValue = string | number | boolean | null | JSONObject | JSONArray

export type SocketConnectionState = 'connected' | 'disconnected'

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
