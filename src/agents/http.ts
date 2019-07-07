interface Config {
  baseUrl?: string
  fetchDefaults?: any
}

export default (config?: Config) => {
  const baseUrl = config && config.baseUrl || ''
  const fetchDefaults = config && config.fetchDefaults || {}

  const perform = (params: any, dispatch: any) => {
    const { url, actions, ...fetchParams } = params

    const headers = new Headers(params.headers)
    if (!headers.has('accept')) {
      headers.append('accept', 'application/json')
    }

    let body
    if (params.body &&
      Object.prototype.toString.call(params.body) === '[object Object]') {
      headers.append('content-type', 'application/json')
      body = JSON.stringify(params.body)
    }

    fetch(baseUrl ? baseUrl + url : url, {
      ...fetchDefaults,
      ...fetchParams,
      body,
      headers
    })
      .then(async (response) => {
        const contentType = response.headers.get('content-type')
        const data = (contentType && contentType.indexOf('application/json') !== -1)
          ? await response.json()
          : await response.text()

        window.setTimeout(() => {
          // Ensure that errors occurring as part of dispatch()
          // (such as errors happening in the reducer) don't also
          // trigger the catch() handler below resulting in a double
          // dispatch.

          dispatch({
            type: response.ok ? actions.success : actions.failure,
            payload: data,
            meta: { status: response.status, final: true }
          })
        })
      })
      .catch((err) => {
        dispatch({
          type: actions.failure,
          meta: { status: 0, err, final: true }
        })
      })
  }

  return {
    perform,
    type: 'http'
  }
}
