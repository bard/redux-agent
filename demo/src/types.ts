import { ActionType } from 'typesafe-actions'
import * as actions from './actions'

export type Action = ActionType<typeof actions>

export interface State {
  httpTodoItem: any | null
  timerCounter: number
  randomNumber: number | null
  liveCurrencyUpdates: {
    events: any[]
    active: boolean
  }
}
