export const getIntents = (state, intentType) =>
      state.intents && state.intents[intentType]

export const addIntent = (state, intent) => {
  const intentType = intent.meta.reactor
  const httpIntents = getIntents(state, intent.meta.reactor) || []
  return {
    ...state,
    intents: {
      ...state.intents,
      [intentType]: [...httpIntents, intent]
    }
  }
}

export const removeIntent = (state, intentType, id) => {
  const i = state.intents[intentType].findIndex(intent => intent.meta.id === id)
  return {
    ...state,
    intents: {
      ...state.intents,
      http: [
        ...state.intents[intentType].slice(0, i),
        ...state.intents[intentType].slice(i + 1)
      ]
    }
  }
}

export const intentReducer = (state, action) => {
  if (action.meta && action.meta.reactor) {
    const intentType = action.meta.reactor
    if (action.type.endsWith('_INTENT')) {
      return addIntent(state, action)
    } else if (action.type.endsWith('_EFFECT')) {
      return removeIntent(state, intentType, action.meta.id)
    }
  } else {
    return state
  }
}
