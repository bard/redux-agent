import React from 'react'
import { connect } from 'react-redux'

class Timer extends React.Component {
  render () {
    if (this.props.active) {
      this.timerId = window.setInterval(
        () => this.props.onTickWanted(this.props.id), 1000)
    } else {
      window.clearInterval(this.timerId)
    }
    return null
  }
}

const mapStateToProps = (state) => ({
  active: state.timerActive === true
})

const mapDispatchToProps = (dispatch) => ({
  onTickWanted: (id) => dispatch({ type: 'TICK', meta: { id } })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer)
