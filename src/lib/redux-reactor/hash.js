const handleChange = (state, stateToHashMapper, dispatch) => {
  const newHash = stateToHashMapper(state)
  document.location.hash = newHash
}

export const createHashReactor = (store, stateToHashMapper) => {
  let currentState
  return () => {
    let nextState = store.getState()
    if (nextState !== currentState) {
      currentState = nextState
      handleChange(currentState, stateToHashMapper, store.dispatch)
    }
  }
}
