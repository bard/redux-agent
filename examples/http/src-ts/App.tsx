import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { HttpAgent } from './agents'
import { State, User } from './types'

interface StateProps {
  user: User
}

interface DispatchProps {
  fetchUser(): void
}

type Props = StateProps & DispatchProps

const App: React.FunctionComponent<Props> = ({ fetchUser, user }) => (
  <div>
    <HttpAgent.Component />
    <button onClick={fetchUser}>Fetch user</button>
    <p>User: {user ? user.name : '[none]'}</p>
  </div>
)

const mapStateToProps = (state: State): StateProps => ({
  user: state.user
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  fetchUser: () => { dispatch({ type: 'FETCH_USER' }) }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
