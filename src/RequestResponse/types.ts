export interface TrackedRequest {
  id: number
  requestState: TrackedRequestState
  callbacks: TrackedRequestCallbacks
  params: any
}

export type TrackedRequestState = 'queued'
  | 'pending'
  | 'success'
  | 'failure'

export interface TrackedRequestCallbacks {
  success: string
  failure: string
}

export interface StateSlice {
  requests: TrackedRequest[]
  lastRequestId: number
}

type RequestStateChangeCallback =
  (status: 'success' | 'failure', result?: any) => void

export interface FactoryArgs<TrackedRequestParams> {
  actionPrefix: string
  stateKey: string
  taskHandler: (
    params: TrackedRequestParams,
    onRequestStateChange: RequestStateChangeCallback) => void
}

export interface FactoryResult<TrackedRequestParams> {
  Component: React.ComponentClass
  reducer: <AppState>(state: AppState, action: any) => AppState
  addTask: <AppState>(
    state: AppState,
    params: TrackedRequestParams,
    callbacks: TrackedRequestCallbacks) => AppState
}
