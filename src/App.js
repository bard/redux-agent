import React from 'react'
import { connect } from 'react-redux'
import { httpIntent } from './intent-reactor'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputValue: '2' }
  }

  render () {
    return (
      <div>
        <label>Account ID: </label>
        <input value={this.state.inputValue}
          onChange={e => this.updateInputValue(e)} />
        <button onClick={() => {
          this.props.onAccountInfoWanted(this.state.inputValue)
        }}>
          Fetch Account Info
        </button>
        <div>{this.props.name}</div>
        <div>
          <img alt='' src={this.props.avatar} />
        </div>
      </div>
    )
  }

  updateInputValue (e) {
    this.setState({ inputValue: e.target.value })
  }
}

const mapStateToProps = (state) => ({
  name: state.account && state.account.first_name,
  avatar: state.account && state.account.avatar
})

const mapDispatchToProps = (dispatch) => ({
  onAccountInfoWanted: (accountId) => {
    dispatch(httpIntent('ACCOUNT_INFO',
                        `https://reqres.in/api/users/${accountId}`))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
