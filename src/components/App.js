import React from 'react'

import View from './View'
import Location from '../lib/redux-reactor/components/Location'
import Timer from '../lib/redux-reactor/components/Timer'
import Http from './Http'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <Http />
        <Timer id='foo' />
        <Location />
        <View />
      </div>
    )
  }
}
