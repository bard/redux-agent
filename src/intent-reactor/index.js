export {
  createHttpReactor,
  httpIntentReducer,
  httpIntent
} from './http'

export {
  createDomReactor
} from './dom'

export const createReactorSequence = (...reactors) => {
  let reacting = false
  return () => {
    if (!reacting) {
      reacting = true
      reactors.forEach(reactor => reactor.call())
      reacting = false
    }
  }
}
