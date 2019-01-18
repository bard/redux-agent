import React from 'react'
import ReactDOM from 'react-dom'
import { ReactReduxContext } from 'react-redux/es/components/Context'

export const createDomReactor = (store, reactComponent, domRoot) => () => {
  // XXX lacks react-redux's optimizations

  const Context = ReactReduxContext

  const contextValue = {
    store,
    storeState: store.getState()
  }

  ReactDOM.render(
    <Context.Provider value={contextValue}>
      {reactComponent}
    </Context.Provider>,
    domRoot)
}
