import React from 'react'

export interface RouteMatch {
  name: string
  params: { [key: string]: string }
}

interface Props {
  name: string
  pattern: string
}

const Route: React.FunctionComponent<Props> = (_props) => (
  null
)

export default Route
