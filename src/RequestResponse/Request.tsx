import { Component } from 'react'
import { TrackedRequestState } from './types'

interface Props {
  id: number
  params: any
  onStateChange(
    state: TrackedRequestState,
    result: any
  ): void
  sendRequest(
    params: any,
    onStateChange: (
      state: TrackedRequestState,
      dataOrError: any
    ) => void
  ): void
}

class Request extends Component<Props, {}> {
  componentDidMount() {
    this.props.sendRequest(
      this.props.params,
      this.props.onStateChange
    )
  }

  render() {
    return null
  }
}

export default Request
