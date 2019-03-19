declare type JSONType = import('./types').JSONObject


declare module module {
  export const hot: any
}

declare interface WebSocket {
  sendJSON(data: any): void
}

// Polyfills

declare module 'core-js/features/array/includes'
declare module 'core-js/features/array/find-index'

interface Array<T> {
  
  // Copied from <typescript>/es2016.array.include.d.ts
  // Polyfill imported in index.ts from core-js
  
  findIndex(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number

  // Copied from <typescript>/es2015.core.d.ts
  // Polyfill imported in index.ts from core-js
  
  includes(searchElement: T, fromIndex?: number): boolean
}
