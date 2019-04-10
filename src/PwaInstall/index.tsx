import produce, { isDraft } from 'immer'
import createDebug from 'debug'
import { createAction, ActionType, getType } from 'typesafe-actions'
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  BeforeInstallPromptEvent,
  PwaInstallTask,
  PwaInstallState,
  PwaInstallAgentFactoryArgs,
  PwaInstallAgentFactoryResult
} from './types'

declare global {
  interface Navigator {
    getInstalledRelatedApps(): Promise<any[]>
  }
}

const debug = createDebug('agent:PwaInstall')

interface StateProps {
  installDesired: boolean
}

interface DispatchProps {
  installed(): void
  installable(): void
  notInstallable(): void
  installCancel(): void
  installSuccess(): void
  installProgress(): void
}

type Props = StateProps & DispatchProps

class PwaInstall extends React.Component<Props, {}> {
  beforeInstallPromptEvent: BeforeInstallPromptEvent | null = null
  giveupWaitingForInstallPromptTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    debug('constructor')
    this.installPromptEventDidFire = this.installPromptEventDidFire.bind(this)
    this.installPromptEventDidNotFire = this.installPromptEventDidNotFire.bind(this)
    this.appInstallEventDidFire = this.appInstallEventDidFire.bind(this)
  }

  componentDidMount() {
    debug('componentDidMount')
    window.addEventListener(
      'beforeinstallprompt', this.installPromptEventDidFire as EventListener,
      false)
    window.addEventListener(
      'appinstalled', this.appInstallEventDidFire, false)
    this.giveupWaitingForInstallPromptTimeoutId = window.setTimeout(
      this.installPromptEventDidNotFire, 10000)
    this.checkForPwa()
  }

  componentWillUnmount() {
    debug('componentWillUnmount')
    window.removeEventListener(
      'beforeinstallprompt', this.installPromptEventDidFire as EventListener,
      false)
    window.removeEventListener(
      'appinstalled', this.appInstallEventDidFire, false)
  }

  componentDidUpdate(prevProps: Props) {
    debug('componentDidUpdate', this.props)
    if (this.props.installDesired !== prevProps.installDesired &&
      this.props.installDesired === true) {
      this.install()
    }
  }

  render() {
    return null
  }

  private async install() {
    debug('deferred prompt')

    if (!this.beforeInstallPromptEvent) {
      throw new Error('cannot install')
    }

    this.beforeInstallPromptEvent.prompt()

    const { outcome } = await this.beforeInstallPromptEvent.userChoice
    if (outcome === 'accepted') {
      // this.props.onInstallAccepted()
      debug('Done! :)')
    } else {
      this.props.installCancel()
    }
    this.beforeInstallPromptEvent = null
  }

  private async checkForPwa() {
    if ('getInstalledRelatedApps' in navigator) {
      const relatedApps = await navigator.getInstalledRelatedApps()
      if (relatedApps.indexOf('XXX') !== -1) {
        this.props.installed()
      }
    }
  }

  private installPromptEventDidFire(event: BeforeInstallPromptEvent) {
    if (this.giveupWaitingForInstallPromptTimeoutId === null) {
      throw new Error('Bug: install timeout was not set.')
    }

    window.clearTimeout(this.giveupWaitingForInstallPromptTimeoutId)
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault()

    debug('event beforeinstallprompt fired')

    // Stash the event so it can be triggered later.
    this.beforeInstallPromptEvent = event

    this.props.installable()
  }

  private installPromptEventDidNotFire() {
    debug('event beforeinstallprompt did not fire within timeout')
    this.props.notInstallable()
  }

  private appInstallEventDidFire(event: Event) {
    debug('install event', event)
    this.props.installSuccess()
  }
}

interface StateSlice {
  installState: PwaInstallState
  installDesired: boolean
}

const createPwaInstallAgent = (
  factoryArgs?: PwaInstallAgentFactoryArgs
): PwaInstallAgentFactoryResult => {

  const actionPrefix = factoryArgs
    ? factoryArgs.actionPrefix || 'PWA_'
    : 'PWA_'

  const stateKey = factoryArgs
    ? factoryArgs.stateKey || 'pwa'
    : 'pwa'

  /// state

  const getStateSlice = (state: any): StateSlice => (state[stateKey] || {})

  /// actions

  const actions = {
    installed: createAction(`${actionPrefix}INSTALLED`),
    installable: createAction(`${actionPrefix}INSTALLABLE`),
    notInstallable: createAction(`${actionPrefix}NOT_INSTALLABLE`),
    installSuccess: createAction(`${actionPrefix}INSTALL_SUCCESS`),
    installCancel: createAction(`${actionPrefix}INSTALL_CANCEL`),
    installProgress: createAction(`${actionPrefix}INSTALL_PROGRESS`),
  }

  /// connected component

  const mapStateToProps = (state: any): StateProps => ({
    installDesired: getStateSlice(state).installDesired
  })

  const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof actions>>): DispatchProps => ({
    installed() { dispatch(actions.installed()) },
    installable() { dispatch(actions.installable()) },
    notInstallable() { dispatch(actions.notInstallable()) },
    installSuccess() { dispatch(actions.installSuccess()) },
    installCancel() { dispatch(actions.installCancel()) },
    installProgress() { dispatch(actions.installProgress()) },
  })

  const Component = connect(
    mapStateToProps,
    mapDispatchToProps
  )(PwaInstall)

  /// reducer

  const reducer = (
    state: any,
    action: ActionType<typeof actions>
  ) => produce(state, (draft: any) => {
    if (draft && !(stateKey in draft)) {
      draft[stateKey] = {
        installState: 'unknown',
        installDesired: false
      } as StateSlice
    }

    const stateSlice = getStateSlice(draft)

    switch (action.type) {
      case getType(actions.installed):
      case getType(actions.installSuccess):
        stateSlice.installState = 'installed'
        break

      case getType(actions.installable):
        stateSlice.installState = 'installable'
        break

      case getType(actions.notInstallable):
        stateSlice.installState = 'not-installable'
        break

      case getType(actions.installProgress):
        stateSlice.installState = 'installing'
        break
    }
  })

  /// state tools

  const withImmer = (state: any, worker: any) => isDraft(state)
    ? worker(state, worker)
    : produce(state, worker)

  const addToTasks = <S extends {}>(
    state: S, task: PwaInstallTask
  ): S => withImmer(state, (draft: S) => {
    switch (task) {
      case 'install':
        getStateSlice(draft).installDesired = true
        break
      default:
        throw new Error(`Invalid task: ${task}`)
    }
  })

  /// selectors

  const getInstallable = (state: any) =>
    ['installable', 'installing'].indexOf(getStateSlice(state).installState) !== -1

  const getInstalled = (state: any) =>
    getStateSlice(state).installState === 'installed'

  return {
    Component,
    reducer,
    addToTasks,
    getInstallable,
    getInstalled
  }
}

export default createPwaInstallAgent
