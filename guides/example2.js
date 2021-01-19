import { addTask } from 'redux-agent'

// UI ACTIONS

export const APP_LOADED = 'APP_LOADED'
export const CREDENTIALS_ENTERED = 'CREDENTIALS_ENTERED'
export const TOKEN_PROVIDED = 'TOKEN_PROVIDED'

// NETWORK ACTIONS

export const SESSION_SUCCESS = 'SESSION_SUCCESS'
export const SESSION_FAILURE = 'SESSION_FAILURE'
export const SUBMIT_CREDENTIALS_SUCCESS = 'SUBMIT_CREDENTIALS_SUCCESS'
export const SUBMIT_CREDENTIALS_FAILURE = 'SUBMIT_CREDENTIALS_FAILURE'
export const VERIFY_TOKEN_SUCCESS = 'VERIFY_TOKEN_SUCCESS'
export const VERIFY_TOKEN_FAILURE = 'VERIFY_TOKEN_FAILURE'

const reducer = (state, action) => {
  switch (action.type) {
    case APP_LOADED: {

    }
    case CREDENTIALS_ENTERED: {

    }
    case TOKEN_PROVIDED: {

    }
    case SESSION_SUCCESS: {

    }

    // ... and so on ...

    default:
      return state
  }
}

export default reducer
