import React, { useEffect } from 'react'

interface OwnProps {
  params: any
  onEvent(
    type: 'success' | 'failure',
    data: any,
    meta?: {
      key: string
      final: boolean,
      err?: any
    }): void
}

type Props = OwnProps

const LocalStorageTask: React.FunctionComponent<Props> = ({
  params, onEvent
}) => {
  useEffect(() => {
    const { op } = params

    switch (op) {
      case 'get': {
        // assert key
        const { key } = params
        const data = window.localStorage.getItem(key)
        if (data !== null) {
          onEvent('success', JSON.parse(data), { key, final: true })
        } else {
          onEvent('failure', null, { key, final: true })
        }
        break
      }

      case 'set': {
        const { key, data } = params
        // XXX assert key, data; find way of typing statically
        window.localStorage.setItem(key, JSON.stringify(data))
        onEvent('success', null, { key, final: true })
        break
      }

      case 'del': {
        const { key } = params
        window.localStorage.removeItem(key)
        onEvent('success', null, { key, final: true })
        break
      }

      case 'pop': {
        const { key } = params
        const data = window.localStorage.getItem(key)
        if (data !== null) {
          window.localStorage.removeItem(key)
          onEvent('success', JSON.parse(data), { key, final: true })
        } else {
          onEvent('failure', null, { key, final: true })
        }
        break
      }

      case 'merge': {
        const { key, data } = params
        const savedData = window.localStorage.getItem(key)
        if (savedData) {
          window.localStorage.setItem(key, JSON.stringify({
            ...JSON.parse(savedData),
            ...data
          }))
        } else {
          window.localStorage.setItem(key, JSON.stringify(data))
        }

        onEvent('success', null, { key, final: true })
        break
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default {
  Component: LocalStorageTask,
  type: 'storage',
  defaults: {}
}
