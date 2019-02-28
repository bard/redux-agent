import produce, { isDraft } from 'immer'
import createDebug from 'debug'
import { createAction, ActionType, getType } from 'typesafe-actions'
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

const debug = createDebug('reactor:WebExtInstall')

interface PropsFromUser {
  chromeInstallUrl: string
}

interface PropsFromState {
  installDesired: boolean
}

interface PropsFromDispatch {
  present(): void
  installAvailable(): void
  installUnavailable(): void
}

type Props = PropsFromUser & PropsFromState & PropsFromDispatch

class WebExtInstall extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props)
    debug('constructor')

    // XXX validate chromeInstallUrl
    this.messageWasReceived = this.messageWasReceived.bind(this)
  }

  componentDidMount() {
    debug('componentDidMount')
    window.addEventListener('message', this.messageWasReceived, false)
    this.checkForWebExt()
  }

  componentWillUnmount() {
    debug('componentWillUnmount')
    window.removeEventListener('message', this.messageWasReceived, false)
  }

  componentDidUpdate(prevProps: Props) {
    debug('componentDidUpdate', this.props.installDesired)
    if (this.props.installDesired !== prevProps.installDesired &&
      this.props.installDesired === true) {
      window.open(this.getInstallUrl())
    }
  }

  render() {
    return null
  }

  private getExtId() {
    return this.props.chromeInstallUrl.split('/').slice(-1).pop() as string
  }

  private getExtOrigin() {
    // XXX ???
    return this.getExtId()
  }

  private messageWasReceived(event: MessageEvent) {
    if (event.origin !== this.getExtOrigin()) {
      return
    }

    // https://developer.chrome.com/extensions/content_scripts#host-page-communication
    // XXX TBD
    if (event.data === 'ext-installed') {
      this.props.present()
    }
  }

  private async checkForWebExt() {
    if ('chrome' in window && typeof chrome.runtime !== 'undefined') {
      try {
        const extId = this.getExtId()
        await this.sendChromeMessage(extId, { type: 'version' })
        this.props.present()
      } catch (err) {
        this.props.installAvailable()
      }
    } else {
      this.props.installUnavailable()
    }
  }

  private getInstallUrl() {
    return this.props.chromeInstallUrl
  }

  private sendChromeMessage(targetId: string, message: any) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(targetId, message, (response) => {
        if (response) {
          resolve(response)
        } else {
          reject(chrome.runtime.lastError)
        }
      })
    })
  }
}

interface StateSlice {
  installed: null | boolean
  installable: null | boolean
  installDesired: boolean
}

const createWebExtInstallReactor = ({
  actionPrefix = 'WEB_EXT_', stateKey = 'webExt'
} = {}) => {
  const getStateSlice = (state: any): StateSlice => (state[stateKey] || {})

  /// actions

  const actions = {
    present: createAction(`${actionPrefix}INSTALLED`),
    installAvailable: createAction(`${actionPrefix}INSTALL_AVAILABLE`),
    installUnavailable: createAction(`${actionPrefix}INSTALL_UNAVAILABLE`),
  }

  /// connected component

  const mapStateToProps = (state: any): PropsFromState => ({
    installDesired: getStateSlice(state).installDesired
  })

  const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof actions>>): PropsFromDispatch => ({
    present() { dispatch(actions.present()) },
    installAvailable() { dispatch(actions.installAvailable()) },
    installUnavailable() { dispatch(actions.installUnavailable()) },
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
    getInstalled
  }
}

export default createWebExtInstallReactor
