import produce, { isDraft } from 'immer'
import includes from 'core-js/library/fn/array/includes'
import createDebug from 'debug'
import { createAction, ActionType, getType } from 'typesafe-actions'
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { BeforeInstallPromptEvent } from './types'

declare global {
  interface Navigator {
    getInstalledRelatedApps(): Promise<any[]>
  }
}

const debug = createDebug('reactor:PwaInstall')

interface PropsFromState {
  installDesired: boolean
}

interface PropsFromDispatch {
  present(): void
  installAvailable(): void
  installUnavailable(): void
  installCancel(): void
  installSuccess(): void
  installProgress(): void
}

type Props = PropsFromState & PropsFromDispatch

class PwaInstall extends React.Component<Props, {}> {
  beforeInstallPromptEvent: BeforeInstallPromptEvent | null = null
  giveupWaitingForInstallPromptTimeoutId: number

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
      'beforeinstallprompt', this.installPromptEventDidFire, false)
    window.addEventListener(
      'appinstalled', this.appInstallEventDidFire, false)
    this.giveupWaitingForInstallPromptTimeoutId = window.setTimeout(
      this.installPromptEventDidNotFire, 10000)
    this.checkForPwa()
  }

  componentWillUnmount() {
    debug('componentWillUnmount')
    window.removeEventListener(
      'beforeinstallprompt', this.installPromptEventDidFire, false)
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
      if (includes(relatedApps, 'XXX')) {
        this.props.present()
      }
    }
  }

  private installPromptEventDidFire(event: BeforeInstallPromptEvent) {
    window.clearTimeout(this.giveupWaitingForInstallPromptTimeoutId)
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault()

    debug('event beforeinstallprompt fired')

    // Stash the event so it can be triggered later.
    this.beforeInstallPromptEvent = event

    this.props.installAvailable()
  }

  private installPromptEventDidNotFire() {
    debug('event beforeinstallprompt did not fire within timeout')
    this.props.installUnavailable()
  }

  private appInstallEventDidFire(event: Event) {
    debug('install event', event)
    this.props.installSuccess()
  }
}

interface StateSlice {
  installed: null | boolean
  installable: null | boolean
  installDesired: boolean
}

const createPwaInstallReactor = ({
  actionPrefix = 'PWA_', stateKey = 'pwa'
} = {}) => {
  const getStateSlice = (state: any): StateSlice => (state[stateKey] || {})

  /// actions

  const actions = {
    present: createAction(`${actionPrefix}PRESENT`),
    installAvailable: createAction(`${actionPrefix}INSTALL_AVAILABLE`),
    installUnavailable: createAction(`${actionPrefix}INSTALL_UNAVAILABLE`),
    installSuccess: createAction(`${actionPrefix}INSTALL_SUCCESS`),
    installCancel: createAction(`${actionPrefix}INSTALL_CANCEL`),
    installProgress: createAction(`${actionPrefix}INSTALL_PROGRESS`),
  }

  /// connected component

  const mapStateToProps = (state: any): PropsFromState => ({
    installDesired: getStateSlice(state).installDesired
  })

  const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof actions>>): PropsFromDispatch => ({
    present() { dispatch(actions.present()) },
    installAvailable() { dispatch(actions.installAvailable()) },
    installUnavailable() { dispatch(actions.installUnavailable()) },
    installSuccess() { dispatch(actions.installSuccess()) },
    installCancel() { dispatch(actions.installCancel()) },
    installProgress() { dispatch(actions.installProgress()) },
  })

  const Component = connect(
    mapStateToProps,
    mapDispatchToProps
  )(PwaInstall)

  /// reducer

  const reducer = <S extends {}>(
    state: S,
    action: ActionType<typeof actions>
  ): S => produce(state, (draft: S) => {
    if (draft && !(stateKey in draft)) {
      draft[stateKey] = {
        installed: null,
        installable: null,
        installDesired: false
      } as StateSlice
    }

    const stateSlice = getStateSlice(draft)

    switch (action.type) {
      case getType(actions.present):
        stateSlice.installed = true
        break

      case getType(actions.installAvailable):
        stateSlice.installable = true
        break

      case getType(actions.installUnavailable):
        stateSlice.installable = false
        break
    }
  })

  /// state tools

  const withImmer = (state: any, worker: any) => isDraft(state)
    ? worker(state, worker)
    : produce(state, worker)

  const scheduleInstall = <S extends any>(state: S): S =>
    withImmer(state, (draft: S) => {
      getStateSlice(draft).installDesired = true
    })

  /// selectors

  const getInstallable = (state: any) =>
    getStateSlice(state).installable

  const getInstalled = (state: any) =>
    getStateSlice(state).installed

  return {
    Component,
    reducer,
    scheduleInstall,
    getInstallable,
    getInstalled,
    actions
  }
}

export default createPwaInstallReactor

