# Tutorial

We'll make a simple "when the user clicks this button, fetch a remote resource and display it" application using Redux Agent and the HTTP task.

We'll use a React app, but Redux Agent does not rely on React and works along any other UI runtime.

## A skeleton app

Create a skeleton with `create-react-app`:

```sh
$ yarn create react-app agent-tutorial
```

Or:

```sh
$ npx create-react-app agent-tutorial
```

Install `redux`, `redux-agent`, `react-redux`, and `redux-logger`.

```sh
$ cd agent-tutorial
yarn add --dev redux react-redux redux-logger redux-agent
```

Set up the entry point `src/index.jsx`:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import App from './App'
import reducer from './reducer'

const store = createStore(reducer, applyMiddleware(logger))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))
```

Set up a basic UI in `src/App.jsx`:

```js
import React from 'react'
import { connect } from 'react-redux'

const App = ({ fetchUser, user }) => (
  <div>
    <button onClick={fetchUser}>Fetch User</button>
    <pre>
      { userData 
        ? JSON.stringify(userData, null, 2)
        : 'no data fetched' }
    </pre>
  </div>
)

const mapStateToProps = (state) => ({ 
  user: state.user 
})

const mapDispatchToProps = (dispatch) => ({
  fetchUser: () => dispatch({ type: 'FETCH_USER' }) 
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
```

Now on to actually using Redux Agent...

## The reducer and the task

Our reducer has three goals:

1. listen for the `FETCH_USER` action dispatched by the UI
1. schedule an HTTP task
1. listen for actions that signal the task success or failure

Create `src/reducer.js`:

```js
import {
  addTask, reduceReducers, taskReducer
} from 'redux-agent'

const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_USER': {
      return addTask(state, {
        type: 'http',
        method: 'get',
        url: 'https://jsonplaceholder.typicode.com/user/1',
        actions: {
          success: 'FETCH_USER_SUCCESS',
          failure: 'FETCH_USER_FAILURE'
        }
      })
    }

    case 'FETCH_USER_SUCCESS': {
      return {
        ...state,
        userInfo: action.payload
      }
    }
  }
}

export default reduceReducers(reducer, taskReducer)
```

Let's walk through the important bits:

```js
    case 'FETCH_USER': {
      return addTask(state, {
        type: 'http',
        method: 'get',
        url: 'https://jsonplaceholder.typicode.com/user/1',
        actions: {
          success: 'FETCH_USER_SUCCESS',
          failure: 'FETCH_USER_FAILURE'
        }
      })
```

The `addTask` helper adds a task description to the application state. (Its sole purpose is to isolate you from the implementation of the task collection, in case it changes in future versions.)

A **task** is a generic abstraction for an operation that we wish to be carried out. 

The task's **type** property determines which task handler will execute the task. Redux Agent currently ships with a few handlers, including HTTP, WebSocket, and timers, and it's easy to create more.

A task may be short-lived, like the HTTP request above, or long-lived, like a timer or a WebSocket connection.

A task execution leads to one or more events we'll want to hear about. For example, an HTTP task will produce just one — either a _success_ or a _failure_ event — wherease a WebSocket will produce several — typically one _connect_ event, several _message_ events, and finally a _disconnect_. Through the **actions** property, we tell Redux Agent what action should be dispatched when a certain event occurs. 

```js
    case 'FETCH_USER_SUCCESS': {
      return {
        ...state,
        userInfo: action.payload
      }
    }
```

We handle the `FETCH_USER_SUCCESS` action by storing its payload (the parsed HTTP request body) into the state.

```js
export default reduceReducers(reducer, taskReducer)
```

Finally, we want every action to flow not just through our application reducer but also through the task reducer. This ensures that the completed tasks are removed from the state. `reduceReducers` returns a reducer that consists of our application reducer plus the task reducer, concatenated.

## The runtime

The runtime reads tasks from the state, executes them, and tells us what they did by dispatching actions. It does its job by observing the store and responding to state changes, like React does via `react-redux`'s `<Provider>` component.

To include the runtime and enable it handle HTTP tasks, add these two lines:

```diff
  import React from 'react'
  import ReactDOM from 'react-dom'
  import { Provider } from 'react-redux'
  import { createStore, applyMiddleware } from 'redux'
+ import { configureAgents, createHttpAgent } from 'redux-agent'
  import logger from 'redux-logger'
  import App from './App'
  import reducer from './reducer'
  
  const store = createStore(reducer, applyMiddleware(logger))

+ store.subscribe(configureAgents([ createHttpAgent() ], store))

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'))
```

## Done!

That's it. Run `yarn start`, click the "Fetch User" button, and the user info will appear.

## Next steps

To view other task types in action, see the [interactive examples](/examples).

To learn more about built-in task types see the reference: [HTTP](reference/http.md), [WebSocket](reference/websocket.md), [Storage](reference/storage.md), [Timer](reference/timer.md), and [Random Number Generator](reference/random-number-generator.md).










