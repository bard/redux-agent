# Redux Agent

React lets you describe a UI and shifts the actual work of drawing it to `ReactDOM.render`. It's a simple and powerful model, however it stops at visual I/O. Network requests and other non-visual I/O are usually performed in a thunk/saga/epic, scattering logic across middlewares and reducers, or from React components, coupling them to remote APIs.

**Redux Agent applies React's model to non-visual I/O**: describe a network request, a storage operation, a websocket message, etc., and let the runtime worry about performing it. Logic stays in the reducer, components stay decoupled, and it's easy to see what state triggers which effect.

Redux Agent doesn't introduce middleware or store enhancers, doesn't change Redux APIs, and doesn't involve exotic concepts. It has only one basic abstraction (the "task"). An HTTP request is as straightforward as:

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
```

## Try it

See Redux Agent in action in one of these interactive demos:

- [HTTP Requests](https://redux-agent.org/demo/#http)
- [Timers](https://redux-agent.org/demo/#timer)
- [Random Number Generation](https://redux-agent.org/demo/#rng)
- [WebSocket Messaging](https://redux-agent.org/demo/#socket)

## Q&A

**"I thought that the reducer should stay free from side effects?"**

Yes. In fact, `addTask` in the example above doesn't perform any effect, it only stores a task description in the state which is later used by the runtime to perform the effect, just like you normally store data in the state which is later used to render the UI.

**"Is this like Elm?"**

Quite. But whereas Elm's reducer returns the new state plus commands, Redux Agent considers active tasks an integral part of the application state and therefore keeps them in the state tree.

**"Is this like redux-loop?"**

Yes and no. Yes, since both make the reducer the single source of logic. No, since redux-loop changes the reducer's API so it can return state plus commands, whereas Redux Agent sticks to vanilla Redux.

## Documentation

- [Quickstart](https://redux-agent.org/quickstart/)
- [Tutorial](https://redux-agent.org/tutorial/)
- [Limitations](https://redux-agent.org/limitations/)
- Guides:
    - [Specifying Task Defaults](https://redux-agent.org/guides/specifying-task-defaults/)
    - [Immer Support](https://redux-agent.org/guides/immer-support/)
- Reference:
    - [HTTP](https://redux-agent.org/reference/http/): Send HTTP requests and track responses. Uses `window.fetch` under the hood
    - [WebSocket](https://redux-agent.org/reference/websocket/): Connect to websocket endpoints, send and listen to messages
    - [RNG](https://redux-agent.org/reference/random-number-generator/): Generate random numbers
    - [Timer](https://redux-agent.org/reference/timer/): Dispatch an action at an interval
    - [Storage](https://redux-agent.org/reference/storage/): Write to and read from DOM storage

## License

MIT

## Credits

`reduceReducers` by [Tim Cheung](https://github.com/timche). Icon by [Setyo Ari Wibowo](https://thenounproject.com/razerk/).
