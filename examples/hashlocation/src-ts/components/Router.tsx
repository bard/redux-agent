import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { HashLocation, Route, RouteMatch } from 'redux-agent'
import { State } from '../types'

interface StateProps {
  location: string
}

interface DispatchProps {
  route(match: RouteMatch): void
}

type Props = StateProps & DispatchProps

const Router: React.FunctionComponent<Props> = (
  { location, route }
) => (
    <HashLocation enabled={true} location={location} onRouteMatch={route}>
      <Route name='item' pattern='/item/:index' />
    </HashLocation>
  )

const mapStateToProps = (state: State): StateProps => ({
  location: mapStateToLocation(state)
})

const mapStateToLocation = (state: State): string => {
  return '/item/' + state.current
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  route(match) {
    dispatch(mapLocationToAction(match))
  }
})

const mapLocationToAction = ({ name, params }: RouteMatch) => {
  switch (name) {
    case 'item':
      return { type: 'GOTO_ITEM', payload: params.index }
    default:
      throw new Error('Invalid route')
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Router)
