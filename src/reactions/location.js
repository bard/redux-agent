export default (state) => {
  if (state.account === null) {
    return '/'
  } else {
    return '/accounts/' + state.account.id
  }
}
