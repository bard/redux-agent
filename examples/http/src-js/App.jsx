import React from 'react';
import { connect } from 'react-redux';
import { HttpAgent } from './agents';
const App = ({ fetchUser, user }) => (<div>
    <HttpAgent.Component />
    <button onClick={fetchUser}>Fetch user</button>
    <p>User: {user ? user.name : '[none]'}</p>
  </div>);
const mapStateToProps = (state) => ({
    user: state.user
});
const mapDispatchToProps = (dispatch) => ({
    fetchUser: () => { dispatch({ type: 'FETCH_USER' }); }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
