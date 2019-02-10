import createDebug from 'debug'
import { Component } from 'react'

const debug = createDebug('reactor:Socket:OutgoingSocketMessage')

// ----------------------------------------------------------------------

interface Props {
  id: number
  data: any
  send(data: any): void
  onSent(id: number): void
}

// ----------------------------------------------------------------------

class OutgoingSocketMessage extends Component<Props, any> {
  componentDidMount() {
    debug(`sending with id ${this.props.id}`, this.props.data)
    this.props.send(this.props.data)
    this.props.onSent(this.props.id)
  }

  render() {
    return null
  }
}

export default OutgoingSocketMessage
