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
  data: JSONStringifyable
  error: any // XXX specify better
}

export interface HttpState {
  outbox: TrackedHttpRequest[]
  lastRequestId: number
}
