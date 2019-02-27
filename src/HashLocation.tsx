import React from 'react'
import Path from 'path-parser'
import createDebug from 'debug'
import { Component } from 'react'

const debug = createDebug('reactor:HashLocation')

interface Props {
  location: string
  enabled: boolean
}

class HashLocation extends Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.locationDidChange = this.locationDidChange.bind(this)
  }

  componentDidMount() {
    debug('componentDidMount')

    window.addEventListener('hashchange', this.locationDidChange)
    if (!window.location.hash) {
      debug('no hash present, setting it')
      // If no hash present, initialize location from state (otherwise
      // keep it as-is and let it trigger an action)
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

    if (prevProps.enabled !== this.props.enabled) {
      debug('enabled changed')
    }
  }

  render() {
    return null
  }

  private updateLocation() {
    const newLocation = '#' + this.props.location
    if (window.location.hash === newLocation) {
      debug(`location already at ${newLocation}, skipping update`)
    } else {
      debug(`setting location to ${newLocation}`)
      this.withLocationListenerPaused(() => {
        window.location.hash = '#' + this.props.location
      })
    }
  }

  private locationDidChange() {
    debug('locationDidChange')
    
    if (this.props.enabled) {
      const locationInput = window.location.hash.substr(1) || '/'
      const matchingRoute = this.findMatchingRoute(
        locationInput,
        React.Children.toArray(this.props.children)
      )
      if (matchingRoute) {
        matchingRoute.onMatch(matchingRoute.params)
      }
    } else {
      debug('navigation disabled')
      this.updateLocation()
    }
  }

  private withLocationListenerPaused(callback: () => void) {
    window.removeEventListener('hashchange', this.locationDidChange)
    callback()
    window.setTimeout(() =>
      window.addEventListener('hashchange', this.locationDidChange))
  }

  private findMatchingRoute(location: string, routes: any[]) {
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
