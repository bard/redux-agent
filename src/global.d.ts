declare type JSONType = import('./types').JSONObject

declare module module {
  export const hot: any
}

declare interface WebSocket {
  sendJSON(data: any): void
}

// Polyfills

declare module 'core-js-pure/features/array/find-index' {
  function _<T>(
    a: T[],
    predicate: (value: T, index: number, obj: T[]) => boolean,
    thisArg?: any): number

  export = _
}
