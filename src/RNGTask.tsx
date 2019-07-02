import React, { useEffect } from 'react'

interface OwnProps {
  params: any
  onEvent(
    type: 'result',
    data: number,
    meta?: { final: boolean }
  ): void
}

type Props = OwnProps

const RNGTask: React.FC<Props> = ({
  onEvent
}) => {
  useEffect(() => {
    onEvent('result', Math.random(), { final: true })
  })

  return null
}

export default {
  type: 'rng',
  Component: RNGTask,
  defaults: {}
}
