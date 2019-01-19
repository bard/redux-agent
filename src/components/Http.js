import React from 'react'
import { connect } from 'react-redux'

class Http extends React.Component {
  render () {
    if (this.props.account &&
        this.props.account.$http) {
      const { effect, url, params } = this.props.account.$http
      window.fetch(url, params)
        .then((response) => response.json())
        .then((data) => this.props.requestDidSucceed(effect, data))
    }

    return null
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = (dispatch) => ({
  requestDidSucceed: (effectType, data) => {
    dispatch({
      type: effectType,
      payload: data
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Http)
