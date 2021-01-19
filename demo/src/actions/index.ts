import { createStandardAction } from 'typesafe-actions'

export * from 'actions/http'
export * from 'actions/timer'
export * from 'actions/rng'
export * from 'actions/websocket'

export const reset = createStandardAction(
  'RESET'
)<void>()
