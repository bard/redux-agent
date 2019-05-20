import { Omit } from '../types'

export type HttpTaskState = 'queued' | 'pending' | 'success' | 'failure'

export interface HttpTaskOpts {
  success: string
  failure: string
}

export type HttpTaskParams =
  { url: RequestInfo } &
  Omit<RequestInit, 'body'> &
  { body?: BodyInit | object }

export interface HttpTask {
  id: number
  opts: HttpTaskOpts
  state: HttpTaskState
  params: HttpTaskParams
}

export interface StateSlice {
  tasks: HttpTask[]
  lastTaskId: number
}

export interface HttpAgentComponentOwnProps {
  baseUrl?: string
}

export interface HttpAgentFactoryArgs {
  actionPrefix: string
  stateKey: string
}

export interface HttpAgentFactoryResult {
  Component: React.ComponentClass<
    HttpAgentComponentOwnProps
  >
  reducer: <AppState>(state: AppState, action: any) => AppState
  addTask: <AppState>(
    state: AppState,
    params: HttpTaskParams,
    opts: HttpTaskOpts) => AppState
}
