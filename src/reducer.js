import { addIntent, httpIntent } from './lib/redux-reactor'

export default (state, action) => {
  switch (action.type) {
    case 'ACCOUNT_INFO':
      return addIntent(state, accountInfoIntent(action.payload))

    case 'ACCOUNT_INFO_EFFECT':
      return {
        ...state,
        account: action.payload.data
      }

    case 'hash/CHANGE':
      return route(state, action.payload)

    default:
      return state
  }
}

// INTENT CREATORS
// ----------------------------------------------------------------------

const accountInfoIntent = (accountId) =>
      httpIntent('ACCOUNT_INFO', `https://reqres.in/api/users/${accountId}`)

const route = (state, location) => {
  const m = location.match(/^\/accounts\/(\d+)$/)
  if (m) {
    const accountId = parseInt(m[1])
    return addIntent(state, accountInfoIntent(accountId))
  } else {
    return state
  }
}
