# redux-agent

**Simple, reactive, middleware-free** effect management for React/Redux applications. Drive non-visual effects (such as network I/O) the same way you drive visual (UI) effects: through changes to application state.

## Example

Respond to the `FETCH_USER` action by requesting data from an HTTP API:

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

Yes. In fact, no network request is generated in the example above. The _information describing_ a request is stored in Redux state and used to generate a network request and handle the network response, just like _information describing_ visual output is ordinarily stored in Redux state and later used to generate a user interface and handle the user's response.

For an in-depth introduction, see the [introduction and tutorial](https://redux-agent.org/intro/reactive-effect-management-with-redux-agent/).
## Documentation

- [Getting started](https://redux-agent.org/getting-started/)
- [Introduction and tutorial](https://redux-agent.org/guides/reactive-effect-management-with-redux-agent/)
- [Status, limitations, differences from other approaches](https://redux-agent.org/status-and-limitations/)
- [The HTTP Agent](https://redux-agent.org/guides/the-http-agent/): manage HTTP requests and responses using `window.fetch`
- [Simplifying reducers with Immer](https://redux-agent.org/guides/simplifying-reducers-with-immer/)
- (_under construction_) [The WebSocket Agent](https://redux-agent.org/guides/the-websocket-agent/): manage WebSocket messaging
- (_under construction_) [The HashLocation Agent](https://redux-agent.org/guides/the-hash-location-agent/): manage hash-based routing
- (_under construction_) [The PwaInstall Agent](https://redux-agent.org/guides/the-pwa-install-agent/): manage the install flow for Progressive Web Applications
- (_under construction_) [The WebExtInstall Agent](https://redux-agent.org/guides/the-web-ext-install-agent/): manage the install flow for web browser extensions
- (_under construction_) [Tutorial: Writing a Redux Agent](https://redux-agent.org/guides/writing-a-redux-agent/)
