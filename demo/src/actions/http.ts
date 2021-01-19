import { createStandardAction } from 'typesafe-actions'

export const fetchTodo = {
  intent: createStandardAction(
    'FETCH_TODO'
  )<void>(),

  success: createStandardAction(
    'FETCH_TODO_SUCCESS'
  )<any>(),

  failure: createStandardAction(
    'FETCH_TODO_FAILURE'
  )<void>()
}
