import { createStandardAction } from 'typesafe-actions'

export const startTimer = createStandardAction(
  'START_TIMER'
)<void>()

export const stopTimer = createStandardAction(
  'STOP_TIMER'
)<void>()

export const stopAllTimers = createStandardAction(
  'STOP_ALL_TIMERS'
)<void>()

export const tick = createStandardAction(
  'TIMER_TICK'
)<void>()
