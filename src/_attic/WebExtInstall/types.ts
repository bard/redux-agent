export type WebExtInstallTask = 'install'

export type WebExtInstallState = 'unknown'
  | 'not-installable'
  | 'installable'
  | 'installing'
  | 'installed'

export interface WebExtInstallAgentFactoryArgs {
  actionPrefix: string
  stateKey: string
}

export interface WebExtInstallAgentFactoryResult {
  Component: React.ComponentClass
  reducer: <AppState>(state: AppState, action: any) => AppState
  addToTasks: <AppState>(
    state: AppState,
    task: WebExtInstallTask) => AppState
  getInstallable: (state: any) => boolean
  getInstalled: (state: any) => boolean
  getStatus: (state: any) => WebExtInstallState
}
