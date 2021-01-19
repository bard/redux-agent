## Installation

```sh
yarn add redux-agent
```

Or:

```sh
npm i redux-agent
```

TypeScript definitions are included.

## Adding to your project

Import the agents near to where the store is configured:

```diff
  import { createStore } from 'redux'
+ import { configureAgents, createHttpAgent } from 'redux-agent'
  import reducer from './reducers'
  
  const store = createStore(reducer)

+ store.subscribe(configureAgents([ createHttpAgent() ], store))
```

Import the helpers in your reducer:

```diff
+ import {
+   addTask, reduceReducers, taskReducer
+ } from 'redux-agent'
  
  const reducer = (state, action) => {
    switch(action.type) {
```

Concatenate your reducer with `taskReducer`:

```diff
    }
  }
  
- export default reducer
+ export default reduceReducers(reducer, taskReducer)
```

That's all. Now you can create tasks and drive effects from the reducer:

```js
  switch(action.type) {
    case 'FETCH_TODO':
      return addTask({ 
        type: 'http', 
        method: 'get', 
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        actions: { 
          success: 'FETCH_TODO_SUCCESS',
          failure: 'FETCH_TODO_FAILURE'
        }
      })
```

## Next steps

- Build a simple app following the [the tutorial](tutorial.md).
- See more examples in the [interactive demos](/examples).
