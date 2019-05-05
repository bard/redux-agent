# redux-agent

Simple, reactive, middleware-free effect management for Redux+React applications. Drive non-visual effects (such as network I/O) the same way you drive visual effects (aka the UI): through changes to application state.

## Benefits

- Vanilla Redux architecture, no new concepts, just old ones doing new work
- Reducer becomes the single source of logic, whether sync or async

## Example

Request data from an HTTP API and display it when received:

```js
const reducer = (state = { user: null }, action) => {
  switch(action.type) {
    case 'FETCH_USER':
      return HttpAgent.addTask(state, {
        method: 'get',
        url: 'http://jsonplaceholder.typicode.com/users/1'
      }, {
        success: 'USER_SUCCESS'
      })

    case 'USER_SUCCESS':
      return {
        ...state,
        user: action.payload
      }

    default:
      return state
  }
}
```

**"But I thought reducers must be pure?"**

Yes. In fact, no network request is sent in the example above. The _information describing_ a request is stored in Redux state and then used to generate network output and handle network input, just like the _information describing_ an interface is stored in Redux state and then used to generate user output and handle user input.

For an in-depth explanation, see the [introduction and tutorial](https://redux-agent.org/intro/reactive-effect-management-with-redux-agent/).

## Documentation

- [Getting started](https://redux-agent.org/getting-started/)
- [Introduction and tutorial](https://redux-agent.org/guides/reactive-effect-management-with-redux-agent/)
- [Status, limitations, and differences from other approaches](https://redux-agent.org/status-and-limitations/)
- [HTTP Agent](https://redux-agent.org/guides/the-http-agent/): HTTP requests
- [WebSocket Agent](https://redux-agent.org/guides/the-websocket-agent/): WebSocket messaging
- (_docs under construction_) [HashLocation Agent](https://redux-agent.org/guides/the-hash-location-agent/): hash-based routing
- (_docs under construction_) [PwaInstall Agent](https://redux-agent.org/guides/the-pwa-install-agent/): install flow for Progressive Web Applications
- (_docs under construction_) [WebExtInstall Agent](https://redux-agent.org/guides/the-web-ext-install-agent/): install flow for web browser extensions
- (_docs under construction_) [Tutorial: Writing a Redux Agent](https://redux-agent.org/guides/writing-a-redux-agent/)

## License

MIT.
