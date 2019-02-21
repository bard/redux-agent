import produce, { isDraft } from 'immer'

// temporary workaround to (apparent) inability to deal with nested
// produce() calls

const withImmer = (state: any, worker: any) => isDraft(state)
  ? worker(state, worker)
  : produce(state, worker)

export default withImmer
