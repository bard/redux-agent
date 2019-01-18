const genIntentId = (req) => req.method + '|' + req.url

const removeHttpIntent = (state, intentId) => {
  const httpIntents = state.intents.http
  const i = httpIntents.findIndex(r => r.id)
  if (i === -1) {
    return state
  } else {
    return {
      ...state,
      intents: {
        ...state.intents,
        http: httpIntents.slice(0, i).concat(httpIntents.slice(i + 1))
      }
    }
  }
}

export const addHttpIntent = (state, intent) => {
  const id = genIntentId(intent)
  const httpIntents = getHttpIntents(state) || []

  if (httpIntents.find(t => t.id === id)) {
    return state
  } else {
    return {
      ...state,
      intents: {
        ...state.intents,
        http: [...httpIntents, { id, ...intent }]
      }
    }
  }
}

export const httpIntentReducer = (state, action) => {
  switch (action.type) {
    case 'reactor.http/INTENT_PICKED':
      return removeHttpIntent(state, action.payload)
    default:
      return state
  }
}

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

const getHttpIntents = (state) =>
      state.intents && state.intents.http

export const createHttpReactor = createGenericReactor(
  getHttpIntents,
  (state, dispatch) => {
    state.forEach(async request => {
      dispatch({
        type: 'reactor.http/INTENT_PICKED',
        payload: request.id
      })

      const { url, method, effect } = request
      const res = await window.fetch(url, { method })

      // dispatch({
      //   type: 'reactor.http/INTENT_DONE',
      //   payload: request.id
      // })

      const data = await res.json()
      dispatch({
        type: effect.type,
        payload: data
      })
    })
  }
)
