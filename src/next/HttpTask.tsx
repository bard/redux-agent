import React, { useEffect } from 'react'

interface OwnProps {
  params: any
  onEvent(
    type: 'success' | 'failure',
    data: any,
    meta?: {
      status: number,
      final: boolean,
      err?: any
    }): void
}

type Props = OwnProps

const HttpTask: React.FunctionComponent<Props> = ({
  params, onEvent
}) => {
  useEffect(() => {
    const { url, baseUrl, ...reqParams } = params

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

    const fetchParams = {
      ...reqParams,
      body,
      headers
    }

    fetch(baseUrl ? baseUrl + url : url, fetchParams)
      .then(async (response) => {
        const contentType = response.headers.get('content-type')
        const data = (contentType && contentType.indexOf('application/json') !== -1)
          ? await response.json()
          : await response.text()

        window.setTimeout(() => {
          // Ensure that any error occurring as part of onEvent()
          // (such as errors happening in the reducer) don't also
          // trigger the catch() handler below.
          onEvent(
            response.ok ? 'success' : 'failure',
            data, {
              status: response.status,
              final: true
            })
        })
      })
      .catch((err) => {
        onEvent('failure', null, {
          status: 0, err, final: true
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default {
  type: 'http',
  Component: HttpTask,
  defaults: {}
}
