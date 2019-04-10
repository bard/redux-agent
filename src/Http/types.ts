import { JSONObject, Omit } from '../types'

export type HttpTaskState = 'queued' | 'pending' | 'success' | 'failure'

export interface HttpTaskOpts {
  success: string
  failure: string
}

export type HttpTaskParams =
  { url: RequestInfo } &
  Omit<RequestInit, 'body'> &
  { body?: BodyInit | JSONObject }

export interface HttpTask {
  id: number
  opts: HttpTaskOpts
  state: HttpTaskState
  params: HttpTaskParams
  data: null | JSONObject
  error: any // XXX specify better
}

export interface StateSlice {
  tasks: HttpTask[]
  lastTaskId: number
}
