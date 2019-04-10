// ----------------------------------------------------------------------
// From: https://stackoverflow.com/questions/51503754/typescript-type-beforeinstallpromptevent

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * @deprecated Only supported on Chrome and Android Webview.
 */
export interface BeforeInstallPromptEvent extends Event {

  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: string[]

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>
}

export type PwaInstallState = 'unknown'
  | 'not-installable'
  | 'installable'
  | 'installing'
  | 'installed'

export type PwaInstallTask = 'install'

export interface PwaInstallAgentFactoryArgs {
  actionPrefix: string
  stateKey: string
}

export interface PwaInstallAgentFactoryResult {
  Component: React.ComponentClass
  reducer: <AppState>(state: AppState, action: any) => AppState
  addToTasks: <AppState>(
    state: AppState,
    task: PwaInstallTask) => AppState
  getInstallable: (state: any) => boolean
  getInstalled: (state: any) => boolean
}
