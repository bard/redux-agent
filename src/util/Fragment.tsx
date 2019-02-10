import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

// Preact doesn't currently support fragments, see
// https://github.com/developit/preact/issues/946
const Fragment = React.Fragment
               ? React.Fragment
               : ({ children }: Props) => <div>{ children }</div>

export default Fragment

