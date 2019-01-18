export default (state, action) => {
  switch (action.type) {
    case 'ACCOUNT_INFO_EFFECT':
      return {
        ...state,
        account: action.payload.data
      }

    default:
      return state
  }
}
