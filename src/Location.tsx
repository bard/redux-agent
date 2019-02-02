import createDebug from 'debug'
import { Component } from 'react'

const debug = createDebug('reactor:Location')

// ----------------------------------------------------------------------

interface Props {
  location: string
  onLocationChange: (location: string) => void
}

// ----------------------------------------------------------------------

class Location extends Component<Props, any> {
  constructor(props: Props) {
    super(props)
    debug('constructor')
    this.locationDidChange = this.locationDidChange.bind(this)
  }

  componentDidMount() {
    debug('componentDidMount')
    window.addEventListener('hashchange', this.locationDidChange)
    this.locationDidChange()
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.locationDidChange)
  }

  componentDidUpdate(prevProps: Props) {
    debug('componentDidUpdate')
    if (prevProps.location !== this.props.location) {
      debug(`updating location to ${this.props.location}`)
      this.withLocationListenerPaused(() => {
        window.location.hash = '#' + this.props.location
      })
    }
  }
  
  render() {
    return null
  }

  // ----------------------------------------------------------------------

  locationDidChange() {
    const location = window.location.hash.substr(1) || '/'
    this.props.onLocationChange(location)
  }

  withLocationListenerPaused(callback: () => void) {
    window.removeEventListener('hashchange', this.locationDidChange)
    callback()
    window.setTimeout(() =>
      window.addEventListener('hashchange', this.locationDidChange))
  }
}

export default Location
