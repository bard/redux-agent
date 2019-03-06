import { JSONObject } from '../types'

export type TrackedRequestState = 'queued' | 'pending' | 'success' | 'failure'

export interface TrackedRequestEffects {
  success: string
  failure: string
}

export interface TrackedHttpRequest {
  id: number
  requestState: TrackedRequestState
  effect: TrackedRequestEffects
  params: RequestInit & { url: RequestInfo }
  data: null | JSONObject
  error: any // XXX specify better
}

export interface StateSlice {
  outbox: TrackedHttpRequest[]
  lastRequestId: number
}
