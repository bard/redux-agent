import invariant from 'invariant'
import produce, { isDraft } from 'immer'
import createDebug from 'debug'
import { createAction, ActionType, getType } from 'typesafe-actions'
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { sendChromeMessage } from './util'

const debug = createDebug('reactor:WebExtInstall')

interface PropsFromUser {
  chromeInstallUrl?: string
  chromeExtId?: string
  firefoxInstallUrl?: string
  firefoxExtId?: string
}

interface PropsFromState {
  installDesired: boolean
  status: InstallState
}

interface PropsFromDispatch {
  installed(): void
  installable(): void
  notInstallable(): void
}

type Props = PropsFromUser & PropsFromState & PropsFromDispatch

class WebExtInstall extends React.Component<Props, {}> {
  private installStatusPollInterval: number
  
  componentDidMount() {
    debug('componentDidMount')
    this.checkForWebExt()
  }

  componentDidUpdate(prevProps: Props) {
    debug('componentDidUpdate', this.props.installDesired)
    if (this.props.installDesired !== prevProps.installDesired &&
      this.props.installDesired === true) {
      window.open(this.getInstallUrl())
      this.pollForInstallStatus()
    }
  }

  render() {
    return null
  }

  private async checkForWebExt() {
    invariant(this.props.status === 'unknown', 'bug')
    
    if ('chrome' in window &&
        typeof chrome.runtime !== 'undefined') {
      if (await this.isWebExtInstalled(this.getExtId())) {
        this.props.installed()
      } else {
        this.props.installable()
      }
    } else {
      this.props.notInstallable()
    }
  }
  
  private pollForInstallStatus() {
    if (this.props.status !== 'installing') {
      throw new Error('Can only poll for install status once installation begins.')
    }

    if (this.installStatusPollInterval !== null) {
      throw new Error('Already polling for install status.')
    }
    
    this.installStatusPollInterval = window.setInterval(async () => {
      if (await this.isWebExtInstalled(this.getExtId())) {
        window.clearInterval(this.installStatusPollInterval)
        this.props.installed()
      }
    }, 1000)      
  }

  private async isWebExtInstalled(extId: string) {
    try {
      await sendChromeMessage(extId, { type: 'version' })
      return true
    } catch (err) {
      return false
    }
  }

  private getExtId(): string {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      if (typeof this.props.firefoxExtId === 'undefined') {
        throw new Error('Extension ID not defined for this browser.')
      }
      return this.props.firefoxExtId
    } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
      if (typeof this.props.chromeExtId === 'undefined') {
        throw new Error('Extension ID not defined for this browser.')
      }
      return this.props.chromeExtId
    } else {
      throw new Error('Extension installation not supported in this browser.')
    }
  }

  private getInstallUrl(): string {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      if (typeof this.props.firefoxInstallUrl === 'undefined') {
        throw new Error('Extension install URL not defined for this browser.')
      }
      return this.props.firefoxInstallUrl
    } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
      if (typeof this.props.chromeInstallUrl === 'undefined') {
        throw new Error('Extension install URL not defined for this browser.')
      }
      return this.props.chromeInstallUrl
    } else {
      throw new Error('Extension installation not supported in this browser.')
    }
  }
}

interface StateSlice {
  installState: InstallState
  installDesired: boolean
}

type InstallState = 'unknown'
                  | 'not-installable'
                  | 'installable'
                  | 'installing'
                  | 'installed'

type Task = 'install'

const createWebExtInstallReactor = ({
  actionPrefix = 'WEB_EXT_', stateKey = 'webExt'
} = {}) => {
  const getStateSlice = (state: any): StateSlice => (state[stateKey] || {})

  /// actions

  const actions = {
    installed: createAction(`${actionPrefix}STATUS_INSTALLED`),
    installable: createAction(`${actionPrefix}STATUS_INSTALLABLE`),
    notInstallable: createAction(`${actionPrefix}STATUS_NOT_INSTALLABLE`),
    installing: createAction(`${actionPrefix}STATUS_INSTALLING`)
  }

  /// connected component

  const mapStateToProps = (state: any): PropsFromState => ({
    installDesired: getStateSlice(state).installDesired,
    status: getStateSlice(state).installState
  })

  const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof actions>>): PropsFromDispatch => ({
    installed() { dispatch(actions.installed()) },
    installable() { dispatch(actions.installable()) },
    notInstallable() { dispatch(actions.notInstallable()) },
  })

  const Component = connect(
    mapStateToProps,
    mapDispatchToProps
  )(WebExtInstall)

  /// reducer

  const reducer = <S extends {}>(
    state: S,
    action: ActionType<typeof actions>
  ): S => produce(state, (draft: S) => {
    if (draft && !(stateKey in draft)) {
      draft[stateKey] = {
        installState: 'unknown',
        installDesired: false
      } as StateSlice
    }

    const stateSlice = getStateSlice(draft)

    switch (action.type) {
      case getType(actions.installed):
        stateSlice.installState = 'installed'
        break
      case getType(actions.installable):
        stateSlice.installState = 'installable'
        break
      case getType(actions.notInstallable):
        stateSlice.installState = 'not-installable'
        break
      case getType(actions.installing):
        stateSlice.installState = 'installing'
        break
    }
  })

  const withImmer = (state: any, worker: any) => isDraft(state)
    ? worker(state, worker)
    : produce(state, worker)

  const addToTasks = <S extends any>(
    state: S,
    task: Task
  ): S => withImmer(state, (draft: S) => {
    switch(task) {
      case 'install':
        getStateSlice(draft).installDesired = true
        break
      default:
        throw new Error(`Invalid task ${task}`)
    }
  })

  /// selectors

  const getStatus = (state: any) =>
    getStateSlice(state).installState

  const getInstallable = (state: any) =>
    getStateSlice(state).installState === 'installable'

  const getInstalled = (state: any) =>
    getStateSlice(state).installState === 'installed'

  return {
    Component,
    reducer,
    addToTasks,
    getStatus,
    getInstallable,
    getInstalled
  }
}

export default createWebExtInstallReactor
