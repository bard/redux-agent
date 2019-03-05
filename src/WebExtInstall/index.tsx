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
  chromeInstallUrl: string
}

interface PropsFromState {
  installDesired: boolean
  status: InstallStatus
}

interface PropsFromDispatch {
  installed(): void
  installable(): void
  notInstallable(): void
}

type Props = PropsFromUser & PropsFromState & PropsFromDispatch

class WebExtInstall extends React.Component<Props, {}> {
  statusPollInterval: number

  constructor(props: Props) {
    super(props)
    debug('constructor')
    // XXX validate chromeInstallUrl
  }

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
    invariant(
      this.props.status === 'installing' && this.statusPollInterval !== null,
      'bug')
    
    this.statusPollInterval = window.setInterval(async () => {
      if (await this.isWebExtInstalled(this.getExtId())) {
        window.clearInterval(this.statusPollInterval)
        this.props.installed()
      }
    }, 1000)      
  }

  private getExtId() {
    return this.props.chromeInstallUrl.split('/').slice(-1).pop() as string
  }

  private async isWebExtInstalled(extId: string) {
    try {
      await sendChromeMessage(extId, { type: 'version' })
      return true
    } catch (err) {
      return false
    }
  }

  private getInstallUrl() {
    return this.props.chromeInstallUrl
  }
}

type InstallStatus = 'unknown' | 'unavailable' | 'available' | 'installing' | 'installed'

interface StateSlice {
  status: InstallStatus
  installDesired: boolean
}

const createWebExtInstallReactor = ({
  actionPrefix = 'WEB_EXT_', stateKey = 'webExt'
} = {}) => {
  const getStateSlice = (state: any): StateSlice => (state[stateKey] || {})

  /// actions

  const actions = {
    installed: createAction(`${actionPrefix}STATUS_INSTALLED`),
    available: createAction(`${actionPrefix}STATUS_AVAILABLE`),
    unavailable: createAction(`${actionPrefix}STATUS_UNAVAILABLE`),
    installing: createAction(`${actionPrefix}STATUS_INSTALLING`)
  }

  /// connected component

  const mapStateToProps = (state: any): PropsFromState => ({
    installDesired: getStateSlice(state).installDesired,
    status: getStateSlice(state).status
  })

  const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof actions>>): PropsFromDispatch => ({
    installed() { dispatch(actions.installed()) },
    installable() { dispatch(actions.available()) },
    notInstallable() { dispatch(actions.unavailable()) },
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
        status: 'unknown',
        installDesired: false
      } as StateSlice
    }

    const stateSlice = getStateSlice(draft)

    switch (action.type) {
      case getType(actions.installed):
        stateSlice.status = 'installed'
        break
      case getType(actions.available):
        stateSlice.status = 'available'
        break
      case getType(actions.unavailable):
        stateSlice.status = 'unavailable'
        break
      case getType(actions.unavailable):
        stateSlice.status = 'installing'
        break
    }
  })

  const withImmer = (state: any, worker: any) => isDraft(state)
    ? worker(state, worker)
    : produce(state, worker)

  const scheduleInstall = <S extends any>(state: S): S =>
    withImmer(state, (draft: S) => {
      getStateSlice(draft).installDesired = true
    })

  /// selectors

  const getStatus = (state: any) =>
    getStateSlice(state).status

  const getInstallable = (state: any) =>
    getStateSlice(state).status === 'available'

  const getInstalled = (state: any) =>
    getStateSlice(state).status === 'installed'

  return {
    Component,
    reducer,
    scheduleInstall,
    getStatus,
    getInstallable,
    getInstalled
  }
}

export default createWebExtInstallReactor
