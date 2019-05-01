import React from 'react'
import pathToRegexp from 'path-to-regexp'
import createDebug from 'debug'
import Route, { RouteMatch } from './Route'

const debug = createDebug('agent:HashLocation')

interface Props {
  location: string
  enabled: boolean
  onRouteMatch(match: RouteMatch): void
}

interface StringMap {
  [key: string]: string
}

type RouteElement = React.ReactElement<React.ComponentProps<typeof Route>>

class HashLocation extends React.Component<Props, {}> {
  private locationListenerPaused = false

  constructor(props: Props) {
    super(props)
    this.browserLocationDidChange = this.browserLocationDidChange.bind(this)
  }

  componentDidMount() {
    debug('componentDidMount')

    window.addEventListener('hashchange', this.browserLocationDidChange)

    if (this.props.enabled === true) {
      this.enable()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.browserLocationDidChange)
  }

  componentDidUpdate(prevProps: Props) {
    debug('componentDidUpdate')

    if (prevProps.enabled !== this.props.enabled && this.props.enabled === true) {
      this.enable()
      return
    }

    if (prevProps.location !== this.props.location) {
      this.setLocationFromProps()
    }
  }

  render() {
    return null
  }

  private enable() {
    debug('enable')
    if (!window.location.hash) {
      // No initial route, initialize from state
      this.setLocationFromProps()
    } else {
      // Location present, we want to go back to the state expressed by it,
      // so simulate a location change.
      this.browserLocationDidChange()
    }
  }

  private setLocationFromProps() {
    debug('updateBrowserLocation')

    const newLocation = '#' + this.props.location

    if (!this.props.enabled) {
      // We usually want routing to be disabled while application is
      // being initialized, so as to avoid a flurry of updates to the
      // browser address bar while state changes.

      debug('agent disabled, skipping update')
      return
    }

    if (window.location.hash === newLocation) {
      // This happens when the sequence of events that led here
      // started with a navigation action that originates out of the app,
      // most likely a back button. For example:
      //
      // - user hits the back button
      // - location changes to #/widget/1
      // - router matches on /widget/:id route
      // - router dispatches { type: 'LOAD_WIDGET', payload: 1 }
      // - application reducer updates state to { currentWidget: 1 }
      // - HashLocation agent "renders" the new state by setting location to #/widget/1
      // - location is already #/widget/1, resulting in no-op

      debug(`location already at ${newLocation}, skipping update`)
      return
    }

    // This happens when the sequence of events that led here
    // started with changing the state. For example:
    //
    // - user clicks on the first item in a list
    // - location changes to #/widget/1
    // - router matches on /widget/:id route
    // - router dispatches { type: 'LOAD_WIDGET', payload: 1 }
    // - application reducer updates state to { currentWidget: 1 }
    // - HashLocation agent "renders" the state to the #/widget/1 location
    // - location listener is paused because this was not a user action
    // - location is updated
    // - location listener is resumed to detect navigation action

    debug(`setting location to ${newLocation}`)
    this.withoutGeneratingNavigationActions(() => {
      window.location.hash = newLocation
    })
  }

  private browserLocationDidChange() {
    debug('browserLocationDidChange')

    if (!this.props.enabled) {
      debug('navigation disabled, skipping')
      return
    }

    if (this.locationListenerPaused) {
      debug('navigation paused, skipping')
      return
    }

    const browserLocation = window.location.hash.substring(1) || '/'

    debug('location:', browserLocation)
    const matchingRoute = this.findMatchingRoute(browserLocation)
    if (matchingRoute) {
      const { name, params } = matchingRoute
      debug(`matched route "${name}", invoking handler`)
      this.props.onRouteMatch({ name, params })
    } else {
      debug('no roture matched, resetting location')
      this.setLocationFromProps()
    }
  }

  private withoutGeneratingNavigationActions(callback: () => void) {
    this.locationListenerPaused = true
    callback()
    // Don't resume the listener before this event loop iteration
    // is over.
    window.setTimeout(() => { this.locationListenerPaused = false }, 0)
  }

  private findMatchingRoute(browserLocation: string) {
    const routes = React.Children.toArray(this.props.children) as RouteElement[]

    for (const route of routes) {
      const { props: { name, pattern } } = route
      const params = matchRoute(browserLocation, pattern)
      if (params) {
        return { name, pattern, params }
      }
    }
    return null
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty

const matchRoute = (path: string, pattern: string): StringMap | null => {
  const keys = [] as pathToRegexp.Key[]
  const params = {} as StringMap
  const regexp = pathToRegexp(pattern, keys)
  const match = regexp.exec(path)
  if (match) {
    // From express
    for (let i = 1; i < match.length; i++) {
      const key = keys[i - 1]
      const prop = key.name
      const val = decodeURIComponent(match[i])

      if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
        params[prop] = val
      }
    }
    return params
  } else {
    return null
  }
}

export default HashLocation
