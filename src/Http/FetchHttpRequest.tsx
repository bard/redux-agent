import createDebug from 'debug'
import { Component } from 'react'
import { HttpTaskState } from './types'

const debug = createDebug('agent:FetchHttpRequest')

interface Props {
  id: number
  baseUrl: string
  defaults: any
  params: RequestInit & { url: RequestInfo }
  onStateChange: (state: HttpTaskState, data: any, meta: any) => void
}

class HttpRequest extends Component<Props, any> {
  componentDidMount() {
    debug('componentDidMount')
    this.sendRequest()
  }

  render() {
    return null
  }

  private async sendRequest() {
    debug('sendRequest')

    const { url, ...params } = this.props.params

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

    const processedParams = {
      credentials: 'same-origin' as RequestCredentials,
      ...this.props.defaults,
      ...params,
      body,
      headers
    }

    try {
      const response = await fetch(this.props.baseUrl + url, processedParams)

      const contentType = response.headers.get('content-type')
      const data = (contentType &&
        contentType.indexOf('application/json') !== -1)
        ? await response.json()
        : await response.text()

      this.props.onStateChange(response.ok ? 'success' : 'failure', data, {
        status: response.status
      })
    } catch (err) {
      this.props.onStateChange('failure', null, {
        status: 0,
        err
      })
    }
  }
}

export default HttpRequest
