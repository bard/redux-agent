import React from 'react'
import Path from 'path-parser'
import createDebug from 'debug'
import { Component } from 'react'

const debug = createDebug('reactor:HashLocation')

interface Props {
  location: string
}

class HashLocation extends Component<Props, any> {
  constructor(props: Props) {
    super(props)
    debug('constructor')
    this.locationDidChange = this.locationDidChange.bind(this)
  }

  componentDidMount() {
    debug('componentDidMount')
    window.addEventListener('hashchange', this.locationDidChange)
    if (!window.location.hash) {
      // If no hash present, initialize it from state. If present, don't change,
      // since it expresses an intent
      this.updateLocation()
    }
    this.locationDidChange()
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.locationDidChange)
  }

  componentDidUpdate(prevProps: Props) {
    debug('componentDidUpdate')
    if (prevProps.location !== this.props.location) {
      this.updateLocation()
    }
  }

  render() {
    return null
  }

  // ----------------------------------------------------------------------

  updateLocation() {
    const newLocation = '#' + this.props.location
    if (window.location.hash === newLocation) {
      debug(`location already at ${newLocation}, skipping update`)
    } else {
      debug(`updating location to ${newLocation}`)
      this.withLocationListenerPaused(() => {
        window.location.hash = '#' + this.props.location
      })
    }
  }

  locationDidChange() {
    const location = window.location.hash.substr(1) || '/'
    debug('locationDidChange', location)
    const match = this.findMatchingRoute(
      location, React.Children.toArray(this.props.children))
    if (match) {
        match.onMatch(match.params)
    }
  }

  withLocationListenerPaused(callback: () => void) {
    window.removeEventListener('hashchange', this.locationDidChange)
    callback()
    window.setTimeout(() =>
      window.addEventListener('hashchange', this.locationDidChange))
  }

  findMatchingRoute(location: string, routes: any[]) {
    // XXX generate Path objects somewhere and just use them here
    return routes.reduce(
      (match, { props: { pattern, onMatch }}) => {
        if (match) {
          return match
        } else {
          const params = new Path(pattern).test(location)
          if (params) {
            return { pattern, params, onMatch }
          }
        }
      }, null)
  }
}

export default HashLocation
