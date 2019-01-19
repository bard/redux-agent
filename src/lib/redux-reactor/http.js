// DEPENDENCIES
// ----------------------------------------------------------------------

import { getIntents } from './intents'

// UTILITIES
// ----------------------------------------------------------------------

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
    let nextState = getIntents(store.getState(), 'http')
    if (nextState !== currentState) {
      applyDiff(diff(currentState, nextState))
      currentState = nextState
    }
  }
}
