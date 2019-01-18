const createGenericReactor = (selector, handleChange) => (store) => {
  let currentState
  return () => {
    let nextState = selector(store.getState())
    if (nextState !== currentState) {
      currentState = nextState
      handleChange(currentState, store.dispatch)
    }
  }
}

export const createTimerReactor = createGenericReactor(
  (state) => state.intents.timer,
  (state, dispatch) => {
    state.forEach(async intent => {
      dispatch({
        type: 'timer/INTENT_PICKED',
        payload: intent.id
      })

      const { url, method, actionType } = intent
      const res = await window.fetch(url, { method })
      const data = await res.json()
      dispatch({
        type: actionType,
        payload: data
      })
    })
  }
)
