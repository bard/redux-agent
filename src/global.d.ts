declare type JSONType = import('./types').JSONObject

declare interface NodeModule {
  hot: any
}

declare interface WebSocket {
  sendJSON(data: any): void
}


