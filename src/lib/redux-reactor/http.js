// UTILITIES
// ----------------------------------------------------------------------

const getHttpIntents = (state) =>
      state.intents && state.intents.http

const diff = (arrayA, arrayB) => {
  arrayA = arrayA || []

  const adds = arrayB.filter(x => !arrayA.includes(x))
        .map(item => ({ type: 'add', item }))

  const dels = arrayA.filter(x => !arrayB.includes(x))
        .map(item => ({ type: 'del', item }))

  return [ ...dels, ...adds ]
}

const runRequest = (req) => {
  const { id, url, ...params } = req
  return window.fetch(url, params)
}

// EXPORTS
// ----------------------------------------------------------------------

let intentCounter = 0

export const httpIntent = (type, url, params = {}) => {
  return {
    type: type + '_INTENT',
    meta: {
      id: intentCounter++,
      reactor: 'http',
      effect: type + '_EFFECT'
    },
    payload: {
      url,
      method: params.method || 'GET',
      ...params
    }
  }
}

export const addHttpIntent = (state, intent) => {
  const httpIntents = getHttpIntents(state) || []
  return {
    ...state,
    intents: {
      ...state.intents,
      http: [...httpIntents, intent]
    }
  }
}

export const removeHttpIntent = (state, id) => {
  const i = state.intents.http.findIndex(intent => intent.meta.id === id)
  return {
    ...state,
    intents: {
      ...state.intents,
      http: [
        ...state.intents.http.slice(0, i),
        ...state.intents.http.slice(i + 1)
      ]
    }
  }
}

export const httpIntentReducer = (state, action) => {
  if (action.meta && action.meta.reactor === 'http') {
    if (action.type.endsWith('_INTENT')) {
      return addHttpIntent(state, action)
    } else if (action.type.endsWith('_EFFECT')) {
      return removeHttpIntent(state, action.meta.id)
    }
  } else {
    return state
  }
}

export const createHttpReactor = (store) => {
  let currentState

  const applyDiff = (ops) => {
    ops.forEach(async (op) => {
      const intent = op.item
      switch (op.type) {
        case 'del':
          break

        case 'add':
          const res = await runRequest(intent.payload)
          store.dispatch({
            type: intent.meta.effect,
            meta: {
              reactor: 'http',
              id: intent.meta.id
            },
            payload: await res.json()
          })
          break
        default:
      }
    })
  }

  return () => {
    let nextState = getHttpIntents(store.getState())
    if (nextState !== currentState) {
      applyDiff(diff(currentState, nextState))
      currentState = nextState
    }
  }
}
