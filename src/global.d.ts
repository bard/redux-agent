declare type JSONType = import('./types').JSONObject


// Temporary. Should be removed after @types/node is no longer
// imported into global scope by transitive dependencies, and replaced
// with:
//
// declare module module {
//   export const hot: any
// }

interface NodeModule {
  hot: any
}

declare interface WebSocket {
  sendJSON(data: any): void
}


// Workaround for using immer in projects targeting ES5.
// https://github.com/mweststrate/immer/issues/321
//
// Temporarily commented out, because @types/node is being imported by
// transitive dependencies. Must be uncommented again when that is no
// longer the case.
//
// declare interface Map<K, V> {}
// declare interface WeakMap<K, V> {}
// declare interface WeakSet<K> {}
// declare interface Set<K> {}

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
