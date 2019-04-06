import createDebug from 'debug'
import { Component } from 'react'
import { TrackedRequestState } from './types'

const debug = createDebug('agent:FetchHttpRequest')

interface Props {
  id: number
  params: RequestInit & { url: RequestInfo }
  onStateChange: (state: TrackedRequestState, dataOrError: any) => void
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
      ...params,
      body,
      headers
    }

    const response = await fetch(url, processedParams)

    if (response.ok) {
      const contentType = response.headers.get('content-type')
      if (contentType &&
        contentType.indexOf('application/json') !== -1) {
        const json = await response.json()
        this.props.onStateChange('success', json)
      } else {
        const text = await response.text()
        this.props.onStateChange('success', text)
      }
    } else {
      this.props.onStateChange('failure', response.status)
    }
  }
}

export default HttpRequest
