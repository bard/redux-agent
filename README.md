# Redux Agent

In UI development, React lets you describe the interface and have the machine worry about drawing it. A simple and powerful model which unfortunately stops at visual I/O. Non-visual I/O such as network requests is usually done in thunks/sagas/epics (scattering logic across middlewares and reducers) or in UI components (coupling them to remote APIs).

**Redux Agent extends React's model to non-visual I/O**: describe a network request, a storage operation, a websocket message, ... and let the machine worry about performing it. Logic stays in the reducer, components stay lightweight, and it's easy to see what state triggers which effect.

Redux Agent doesn't introduce middlewares, doesn't modify existing APIs, and doesn't involve exotic concepts; it has only one basic abstraction (the "task") and is UI agnostic. Sending an HTTP request is as simple as:

```js
import { addTask } from 'redux-agent'

const reducer = (state, action) => {
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
    case 'FETCH_TODO_SUCCESS':
      return {
        ...state,
        items: [ ...state.items, action.payload ]
      }
```

## Try it

See Redux Agent in action in one of these interactive examples:

- [HTTP Requests](https://redux-agent.org/examples/#http)
- [Timers](https://redux-agent.org/examples/#timer)
- [Random Number Generation](https://redux-agent.org/examples/#rng)
- [WebSocket Messaging](https://redux-agent.org/examples/#socket)
- DOM Storage (_coming soon_)

## Q&A

**"I thought that the reducer should stay free from side effects?"**

Yes. In fact, `addTask` in the example above doesn't perform any effect, it only stores a task description in the state which is later used by the runtime to perform the effect, just like you normally store data in the state which is later used to render the UI.

**"What if I want to not just add a task but also modify the state in other ways?"**

`addTask` simply returns a new state that includes the desired task. You can further derive new states as usual:

```diff
    case 'FETCH_TODO':
-     return addTask(state, { /* ... */ })
+     const s1 = addTask(state, { /* ... */ })
+     return { ...s1, isLoading: true }
```

Or make it even easier on the eyes with Redux Agent's built-in [support for Immer](https://redux-agent.org/guides/immer-support/).

**"Is this similar to Elm?"**

Quite. But whereas Elm's reducer returns the new state plus commands, Redux Agent considers active tasks an integral part of the application state and therefore keeps them in the state tree.

**"Is this similar to redux-loop?"**

Yes and no. Yes, since both make the reducer the single source of logic. No, since redux-loop changes the reducer's API so it can return state plus commands, whereas Redux Agent uses vanilla Redux APIs.

## Documentation

- [Quickstart](https://redux-agent.org/quickstart/)
- [Tutorial](https://redux-agent.org/tutorial/)
- [Limitations](https://redux-agent.org/limitations/)
- [Immer Support](https://redux-agent.org/guides/immer-support/)
- Reference:
    - [HTTP](https://redux-agent.org/reference/http/): Send HTTP requests and track responses. Uses `window.fetch` under the hood
    - [WebSocket](https://redux-agent.org/reference/websocket/): Connect to websocket endpoints, send and listen to messages
    - [Storage](https://redux-agent.org/reference/storage/): Write to and read from DOM storage
    - [RNG](https://redux-agent.org/reference/random-number-generator/): Generate random numbers
    - [Timer](https://redux-agent.org/reference/timer/): Dispatch an action at an interval

## License

MIT

## Credits

`reduceReducers` by [Tim Cheung](https://github.com/timche). Icon by [Setyo Ari Wibowo](https://thenounproject.com/razerk/).
