import { createStandardAction } from 'typesafe-actions'

export const generateRandomNumber = {
  intent: createStandardAction(
    'RANDOM_NUMBER'
  )<void>(),

  result: createStandardAction(
    'RANDOM_NUMBER_RESULT'
  )<number>()
}
