declare type JSONType = import('./types').JSONObject

declare module module {
  export const hot: any
}

declare module 'core-js/library/fn/array/find-index' {
  const _: any
  export = _
}

declare module 'core-js/library/fn/array/includes' {
  const _: any
  export = _
}

declare interface WebSocket {
  sendJSON(data: any): void
}

// https://github.com/mweststrate/immer/issues/321
declare interface Map<K, V> {}
declare interface WeakMap<K, V> {}
declare interface WeakSet<K> {}
declare interface Set<K> {}
