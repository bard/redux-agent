export default () => {
  const perform = (params: any, dispatch: any) => {
    const { op, actions } = params

    switch (op) {
      case 'get': {
        // assert key
        const { key } = params
        const data = window.localStorage.getItem(key)
        if (data !== null) {
          dispatch({
            type: actions.success,
            payload: JSON.parse(data),
            meta: { key, final: true }
          })
        } else {
          dispatch({
            type: actions.failure,
            meta: { key, final: true }
          })
        }
        break
      }

      case 'set': {
        const { key, data } = params
        // XXX assert key, data; find way of typing statically
        window.localStorage.setItem(key, JSON.stringify(data))
        dispatch({
          type: actions.success,
          meta: { key, final: true }
        })
        break
      }

      case 'del': {
        const { key } = params
        window.localStorage.removeItem(key)
        dispatch({
          type: actions.success,
          meta: { key, final: true }
        })
        break
      }

      case 'pop': {
        const { key } = params
        const data = window.localStorage.getItem(key)
        if (data !== null) {
          window.localStorage.removeItem(key)
          dispatch({
            type: actions.success,
            payload: JSON.parse(data),
            meta: { key, final: true }
          })
        } else {
          dispatch({
            type: actions.failure,
            meta: { key, final: true }
          })
        }
        break
      }

      case 'merge': {
        const { key, data } = params
        const savedData = window.localStorage.getItem(key)
        if (savedData) {
          window.localStorage.setItem(key, JSON.stringify({
            ...JSON.parse(savedData),
            ...data
          }))
        } else {
          window.localStorage.setItem(key, JSON.stringify(data))
        }

        dispatch({
          type: actions.success,
          meta: { key, final: true }
        })
        break
      }
    }
  }

  return {
    perform,
    type: 'storage'
  }
}
