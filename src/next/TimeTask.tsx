import React, { useEffect } from 'react'

interface OwnProps {
  params: any
  onEvent(
    type: 'tick',
    data: null,
    meta?: { final: boolean }
  ): void
}

type Props = OwnProps

const TimeTask: React.FC<Props> = ({
  onEvent, params
}) => {
  useEffect(() => {
    const t = window.setInterval(
      () => onEvent('tick', null),
      params.interval || 1000)

    return function cleanup() {
      window.clearInterval(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.interval])

  return null
}

export default TimeTask
