
The WebSocket task handler allows to create a WebSocket connection, send messages, and listen on incoming ones.

## Configuration

| Parameter | Type | Description |
|-----------|------|-------------|
| socketFactory | `(connectionUrl: string) => WebSocketLike` | Optional. Function that will be used to create the socket, useful to provide compatibility layers (e.g. Primus, SockJS) or enhanced versions of WebSocket. Defaults to creating a standard WebSocket | 
| encode | `(data: any) => any` | Optional. Function to encode data from a `send` task into a wire format. Defaults to `JSON.stringify` |
| decode | `(data: any) => any` | Optional. Function to decode data from the wire into a format useful for application code. Defaults to `JSON.parse` |


Example:

```js
import ReconnectingWebSocket from 'reconnecting-websocket'
import { configureAgents, createSocketAgent } from 'redux-agent'

store.subscribe(configureAgents([
  createSocketAgent({ 
    // Provide enhanced/wrapped implementation
    socketFactory: (url) => new ReconnectingWebSocket(url)
    // skip JSON encoding
    encode: (data) => data,
    // skip JSON decoding
    decode: (data) => data 
  })
], store))
```

## Task: Listen

This task describes a connection intent, the actions that will to notify about connection status, and the action that will notify of incoming messages.

```js
{
  type: 'socket',
  op: 'listen',
  url: string,          // socket endpoint URL, e.g. wss://example.com/
  actions: {
    connect: string,    // action type to dispatch when the socket connects
    disconnect: string, // action type to dispatch when the socket disconnects
    error: string,      // action type to dispatch when an error occurs
    message: string,    // action type to dispatch when a message is received
  }
}
```

!!! tip
    To disconnect a socket, simply remove the task (see how in the [example](#example)).


### Actions

Event Type | Meta | Payload |
-----------|------|---------|
`connect` | None | None |
`disconnect` | None | None |
`error`  | None | None |
`message` | None | Received message |

## Task: Send

```js
{
  type: 'socket',
  op: 'send',
  data: any,      // data to send, will be encoded to JSON
  actions: {
    sent: string // action type to dispatch when the message has been sent
  }
}
```

!!! warning
    The `sent` action can be a dummy (it doesn't need to be handled by any reducer) but needs to be dispatched, and thus specified, because it will signal to the task reducer that the `send` task can be removed from the store. This requirement will be lifted in future versions.

### Actions

Name | Meta | Payload |
-----|------|---------|
`sent` | None | Note |

## Example

[Run this example »](/examples/#socket)

```js
--8<--
demo/src/examples/socket.js
--8<--
```

