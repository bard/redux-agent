import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

// XXX fragments will be available in Preact 9
// See https://github.com/developit/preact/issues/946

const Fragment = ({ children }: Props) => (
  <div>{ children }</div>
)

export default Fragment
