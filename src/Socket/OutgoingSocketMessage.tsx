import { Component } from 'react'

// ----------------------------------------------------------------------

interface Props {
  id: number
  data: any
  primus: any
  onSent: (id: number) => void
}

// ----------------------------------------------------------------------

class OutgoingSocketMessage extends Component<Props, any> {
  componentDidMount() {
    // XXX doing this here to prevent accidental re-renders; but should
    // technically be in render
    this.props.primus.write(this.props.data)
    this.props.onSent(this.props.id)
  }

  render() {
    return null
  }
}

export default OutgoingSocketMessage
