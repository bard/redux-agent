import React from 'react'
import Path from 'path-parser'
import createDebug from 'debug'
import Route from './Route'

const debug = createDebug('agent:HashLocation')

interface Props {
  location: string
  enabled: boolean
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
      this.updateBrowserLocation()
    }
  }

  render() {
    return null
  }

  private enable() {
    if (!window.location.hash) {
      // No initial route, initialize from state
      this.updateBrowserLocation()
    } else {
      // Location present, we want to go back to the state expressed by it,
      // so simulate a location change.
      this.browserLocationDidChange()
    }
  }

  private updateBrowserLocation() {
    debug('updateBrowserLocation')

    const newLocation = '#' + this.props.location

    if (!this.props.enabled) {
      // We usually want the agent to be disabled while application is
      // being initialized, so as to avoid a flurry of updates to the
      // browser location while state changes.

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
      // - HashLocation agent "renders" the state to the #/widget/1 location
      // - location is already #/widget/1 resulting in no-op

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
    // - location listener is paused because this is not a user navigation action
    // - location is updated
    // - location listener is resumed to detect navigation action

    debug(`setting location to ${newLocation}`)
    this.withoutGeneratingNavigationActions(() => {
      window.location.hash = '#' + this.props.location
    })
  }

  private browserLocationDidChange() {
    debug('locationDidChange')

    if (!this.props.enabled) {
      debug('navigation disabled, skipping')
      return
    }

    if (this.locationListenerPaused) {
      debug('navigation paused, skipping')
      return
    }

    const browserLocation = window.location.hash.substring(1) || '/'

    const matchingRoute = this.matchRoute(browserLocation)
    if (matchingRoute) {
      matchingRoute.onMatch(matchingRoute.params)
    }
  }

  private withoutGeneratingNavigationActions(callback: () => void) {
    this.locationListenerPaused = true
    callback()
    // Don't resume the listener before this event loop iteration
    // is over.
    window.setTimeout(() => { this.locationListenerPaused = false }, 0)
  }

  private matchRoute(browserLocation: string) {
    const routes = React.Children.toArray(this.props.children) as RouteElement[]

    for (const route of routes) {
      const { props: { pattern, onMatch } } = route
      const params = new Path(pattern).test(browserLocation)
      if (params) {
        return { pattern, params, onMatch }
      }
    }
    return null
  }
}

export default HashLocation
