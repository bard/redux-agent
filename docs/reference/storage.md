The storage task handler allows reading from and writing to the DOM `localStorage` object. 

It provides basic get, set, and delete operations, plus convenience operations such as pop (atomic get plus delete) or merge (atomic get plus shallow merge). 

Data is encoded as JSON before writing and decoded before reading.

## Task: Set

Write a value to local storage.

```js
{
  type: 'storage',
  op: 'set',
  key: string,       // key to look up data with
  data: any,         // JSON-encodable value (object, string, boolean, etc.)
  actions: {
    success: string, // action type to dispatch when data has been read
    failure: string  // action type to dispatch when data could not be read
  }
}
```

### Actions

Event Type | Description | Meta | Payload |
-----------|-------------|------|---------|
`success` | Dispatched when data has been written | `{ key: string }` | None |
`failure` | Dispatched when data could not be written | `{ key: string }` | None |

## Task: Get

Read a value from local storage.

```ts
interface LocalStorageGetTask {
  type: 'storage',
  op: 'get',
  key: string,       // key of the value to read
  actions: {
    success: string, // action type to dispatch when data has been read
    failure: string  // action type to dispatch when data could not be read
  }
}
```

### Actions

Event Type | Description | Meta | Payload |
-----------|-------------|------|---------|
`success` | Dispatched when data has been read | `{ key: string }` | The requested data |
`failure` | Dispatched when data could not be read | `{ key: string }` | None |

## Task: Del

Delete a value from local storage.

```ts
interface LocalStorageDelTask {
  type: 'storage',
  op: 'del',
  key: string,       // key of the value to be deleted
  actions: {
    success: string, // action type to dispatch when data has been read
    failure: string  // action type to dispatch when data could not be read
  }
}
```

Name | Type | Description
-----|------|------------
`type` | string | Must be `'storage'`
`op` | string | Must be `'del'`
`key` | string | Key of the data item
`actions` | object | Actions to dispatch depending on task execution, in the form `{ [eventType]: actionName }`. See below for available actions

### Actions

Event Type | Description | Meta | Payload |
-----------|-------------|------|---------|
`success` | Dispatched when data has been deleted | `{ key: string }` | None |
`failure` | Dispatched when the data could not be deleted | `{ key: string }` | None |

## Task: Pop

Read and remove a value data from local storage in one go.

```ts
interface LocalStoragePopTask {
  type: 'storage',
  op: 'pop',
  key: string,       // key of the valued to be read
  actions: {
    success: string, // action type to dispatch when data has been read
    failure: string  // action type to dispatch when data could not be read
  }
}
```

### Actions

Event Type | Meta | Payload |
-----------|-------------|------|
`success` | `{ key: string }` | The requested data, JSON-decoded |
`failure` | `{ key: string }` | None |

## Task: Merge

Update a stored value by shallow-merging new data with it.

```ts
interface LocalStorageSetTask {
  type: 'storage',
  op: 'set',
  key: string,       // key of the value to be updated
  data: object,      // data to shallow-merge with the existing value
  actions: {
    success: string, // action type to dispatch when data has been read
    failure: string  // action type to dispatch when data could not be read
  }
}
```

### Actions

Event Type | Description | Meta | Payload |
-----------|-------------|------|---------|
`success` | Dispatched when data has been merged | `{ key: string }` | None |
`failure` | Dispatched when data could not be merged | `{ key: string }` | None |


