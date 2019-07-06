export default () => {
  const perform = (params: any, dispatch: any) => {
    const { actions } = params

    dispatch({
      type: actions.result,
      payload: Math.random(),
      meta: { final: true }
    })
  }

  return {
    perform,
    type: 'rng'
  }
}
