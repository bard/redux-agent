import { Component } from 'react'

import { TrackedRequestState } from './types'

// ----------------------------------------------------------------------

interface Props {
  id: number
  params: RequestInit & { url: RequestInfo }
  onStateChange: (state: TrackedRequestState, dataOrError: any) => void
}

class HttpRequest extends Component<Props, any> {
  componentDidMount() {
    const { url, ...params } = this.props.params
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        ...params.headers,
      },
      credentials: 'same-origin',
      ...params
    }).then(response => {
      if (!response.ok) {
        throw response.status
      }
      return response.json()
    }).then(json => {
      this.props.onStateChange('success', json)
    }).catch(error => {
      this.props.onStateChange('failure', error)
    })
  }

  render() {
    return null
  }
}

export default HttpRequest
