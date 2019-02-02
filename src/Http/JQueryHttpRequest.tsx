import $ from 'jquery'
import { Component } from 'react'

import { TrackedRequestState } from './types'

// ----------------------------------------------------------------------

interface Props {
  id: number
  params: JQueryAjaxSettings
  onStateChange: (state: TrackedRequestState, dataOrError: any) => void
}

class HttpRequest extends Component<Props, any> {
  componentDidMount() {
    // XXX doing this here to prevent accidental re-renders; but should
    // technically be in render
    $.ajax({
      headers: {
        'Accept': 'application/json, text/javascript; q=0.01',
        ...this.props.params.headers
      },
      ...this.props.params
    }).then(data => {
      this.props.onStateChange('success', data)
    }).catch(error => {
      this.props.onStateChange('failure', error)
    })
  }

  render() {
    return null
  }
}

export default HttpRequest
