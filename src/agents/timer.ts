export default () => {
  const perform = (params: any, dispatch: any) => {
    const { actions, interval } = params

    const timerId = window.setInterval(
      () => dispatch({ type: actions.tick }),
      interval || 1000)

    return function cleanup() {
      window.clearInterval(timerId)
    }
  }

  return {
    perform,
    type: 'timer'
  }
}
