let immer: { isDraft: ((data: any) => boolean) } | null

try {
  // @ts-ignore
  // tslint:disable-next-line no-var-requires
  immer = require('immer')
} catch {
  immer = null
}

export default immer
