import { JSONObject } from '../types'

export type TrackedRequestState = 'success' | 'failure' | 'pending'

export interface TrackedRequestEffects {
  success: string
  failure: string
}

export interface TrackedHttpRequest {
  id: number
  state: TrackedRequestState
  effect: TrackedRequestEffects
  params: RequestInit & { url: RequestInfo }
  data: JSONObject
  error: any // XXX specify better
}

export interface StateSlice {
  outbox: TrackedHttpRequest[]
  lastRequestId: number
}
