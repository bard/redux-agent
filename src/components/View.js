import React from 'react'
import { connect } from 'react-redux'

class View extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputValue: '2' }
  }

  updateInputValue (e) {
    this.setState({ inputValue: e.target.value })
  }

  render () {
    return (
      <div>
        <h3>Example: Timer (output to console)</h3>
        <button onClick={() => this.props.onTimerStartWanted()}>
          Start Timer
        </button>
        &nbsp;
        <button onClick={() => this.props.onTimerStopWanted()}>
        Stop Timer
        </button> &nbsp;
        <hr />

        <h3>Example: HTTP requests</h3>
        <label>Account ID: </label>
        <input value={this.state.inputValue} onChange={e => this.updateInputValue(e)} />
        <button onClick={() => { this.props.onAccountInfoWanted(this.state.inputValue) }}>
          Show Account
        </button>
        <div>{this.props.account.name}</div>
        <div>
          <img alt='' src={this.props.account.avatar} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account && state.account.first_name ? {
    name: state.account.first_name,
    avatar: state.account.avatar
  } : {}
})

const mapDispatchToProps = (dispatch) => ({
  onAccountInfoWanted: (accountId) => {
    dispatch({ type: 'ACCOUNT_INFO', payload: accountId })
  },
  onTimerStartWanted: () => {
    dispatch({ type: 'TIMER_START' })
  },
  onTimerStopWanted: () => {
    dispatch({ type: 'TIMER_STOP' })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
