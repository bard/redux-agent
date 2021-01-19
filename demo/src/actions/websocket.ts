import { createStandardAction } from 'typesafe-actions'

export const connectWebSocket = createStandardAction(
  'CONNECT_WEB_SOCKET'
)<void>()

export const subscribeToCurrencyInfo = createStandardAction(
  'SUBSCRIBE_TO_CURRENCY_INFO'
)<void>()

export const disconnectWebSocket = createStandardAction(
  'DISCONNECT_WEB_SOCKET'
)<void>()

export const socket = {
  connected: createStandardAction('SOCKET_CONNECTED')<void>(),
  disconnected: createStandardAction('SOCKET_DISCONNECTED')<void>(),
  messageReceived: createStandardAction('SOCKET_MESSAGE_RECEIVED')<any>(),
  error: createStandardAction('SOCKET_ERROR')<void>(),
  messageSent: createStandardAction('SOCKET_MESSAGE_SENT')<void>()
}
