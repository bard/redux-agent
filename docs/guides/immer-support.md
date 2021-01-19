Immer is a discover-it-then-cant-live-without-it library that lets you create immutable objects using an imperative-looking API, greatly enhancing readability. For example, the following:

```js
  switch (action.type) {
    case 'USER_RENAME':
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload
        }
      }
  }
```

...using Immer becomes:

```js
  switch (action.type) {
    case 'USER_RENAME':
      draft.user.name = action.payload
      return
  }
```

Redux Agent's `addTask` and `delTasks` helpers have built-in support for Immer: pass them an Immer `draft` and you can use them imperatively. This:

```js
import { addTask } from 'redux-agent'

const getTodo = (id) => ({ /* ... */ })

const reducer = (state, action) => {
  switch(action.type) {
  
    case 'FETCH_USER':
      return addTask(
        { ...state, isLoading: true }, 
        getTodo(1)
      )
```

...using Immer becomes:

```js
import { produce } from 'immer'
import { addTask } from 'redux-agent'

const getTodo = (id) => ({ /* ... */ })

const reducer = (state, action) => produce(state, (draft) => {
  switch(action.type) {
  
    case 'FETCH_USER':
      addTask(draft, getTodo(1))
      draft.isLoading = true
      return
```

Read more about Immer in <a href="https://hackernoon.com/introducing-immer-immutability-the-easy-way-9d73d8f71cb3" target="_blank">Introducing Immer: Immutability the easy way</a> and on its <a href="https://github.com/immerjs/immer" target="_blank">project page</a>.

