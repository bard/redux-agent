import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { HashLocation, Route } from 'redux-agent'
import { State } from '../types'

interface StateProps {
  location: string
}

interface DispatchProps {
  navigatedToItem(params: any): void
}

type Props = StateProps & DispatchProps

const Router: React.FunctionComponent<Props> = (
  { location, navigatedToItem }
) => (
    <HashLocation enabled={true} location={location}>
      <Route pattern='/item/:index' onMatch={navigatedToItem} />
    </HashLocation>
  )

const mapStateToProps = (state: State): StateProps => ({
  location: '/item/' + state.current
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  navigatedToItem(params) {
    dispatch({
      type: 'GOTO_ITEM',
      payload: params.index
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Router)
