import React from 'react'
import { connect } from 'react-redux'

class Location extends React.Component {
  constructor (props) {
    super(props)
    window.addEventListener('hashchange', this.hashListener)
  }

  hashListener () {
    this.props.hashLocationDidChange(window.location.hash.substr(1))
  }

  render () {
    window.removeEventListener('hashchange', this.hashListener)
    if (this.props.account) {
      window.location.hash = '#/accounts/' + this.props.account.id
    } else {
      window.location.hash = '#/'
    }
    setImmediate(() => window.addEventListener('hashchange', this.hashListener))
    return null
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = (dispatch) => ({
  hashLocationDidChange: (location) => {
    dispatch({
      type: 'new/LOCATION',
      payload: location
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Location)
