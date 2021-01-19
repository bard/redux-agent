import React, { useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import { useDispatch, useSelector } from 'react-redux'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import * as examples from 'examples'
import { State } from '../types'
import * as actions from '../actions'
import { useLocationHash } from './util'
import Example from './Example'
import Nav from './Nav'
import Action from './Action'
import TopBar from './TopBar'

export const SECTIONS = {
  '#http': 'HTTP Requests',
  '#rng': 'Random Number Generation',
  '#timer': 'Timers',
  '#socket': 'WebSocket Messaging'
}

export type Section = keyof typeof SECTIONS

const App: React.FunctionComponent<{}> = () => {
  const dispatch = useDispatch()
  const state = useSelector(state => state)
  const socketActive = useSelector(
    (state: State) => state.liveCurrencyUpdates.active)
  const hash = useLocationHash()
  useEffect(
    () => { window.scrollTo(0, 0) }, [hash])

  const section = Object.keys(SECTIONS).includes(hash)
    ? hash as Section
    : '#http'

  return (
    <div>
      <CssBaseline />
      <TopBar />
      <Container maxWidth='lg'>
        <Box mt={12} />

        <Grid container>
          <Grid item md={2}>
            <Nav current={section} sections={SECTIONS} />
          </Grid>

          <Grid item md={10} lg={9}>
            {section === '#http' &&
              <Example
                title='Example: HTTP Request'
                description='Goal: Fetch a to-do item from a REST API.'
                actions={
                  <Action
                    label='FETCH TODO'
                    onClick={() => dispatch(actions.fetchTodo.intent())} />}
                state={state}
                source={examples.http}
                referenceUrl='/reference/http/'
              />}

            {section === '#timer' &&
              <Example
                title='Example: Timer'
                description='Goal: Receive an action every 500ms.'
                actions={
                  <>
                    <Action
                      label='START TIMER'
                      onClick={() => dispatch(actions.startTimer())} />
                    <Action
                      label='STOP ALL TIMERS'
                      onClick={() => dispatch(actions.stopAllTimers())} />
                  </>}
                state={state}
                source={examples.timer}
                referenceUrl='/reference/timer/'
              />}

            {section === '#rng' &&
              <Example
                title='Example: Random Number Generation'
                description='Goal: Generate a random number.'
                actions={
                  <Action
                    label='GENERATE RANDOM NUMBER'
                    onClick={() => dispatch(actions.generateRandomNumber.intent())} />}
                state={state}
                source={examples.rng}
                referenceUrl='/reference/random-number-generator/'
              />}

            {section === '#socket' &&
              <Example
                title='Example: WebSocket'
                description='Goal: Receive live currency updates.'
                actions={<>
                  <Action
                    label='CONNECT WEB SOCKET'
                    onClick={() => dispatch(actions.connectWebSocket())}
                    disabled={socketActive} />
                  <Action
                    label='SUBSCRIBE TO CURRENCY INFO'
                    onClick={() => dispatch(actions.subscribeToCurrencyInfo())}
                    disabled={!socketActive} />
                  <Action
                    label='DISCONNECT WEB SOCKET'
                    onClick={() => dispatch(actions.disconnectWebSocket())}
                    disabled={!socketActive} />
                </>}
                state={state}
                source={examples.socket}
                referenceUrl='/reference/websocket/'
              />}
          </Grid>
        </Grid>

        <Box mb={4} />
      </Container>
    </div>
  )
}

export default App
