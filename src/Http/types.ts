type JSONObject = {[key: string]: JSONValue}
interface JSONArray extends Array<JSONValue> {}
type JSONValue = string | number | boolean | null | JSONObject | JSONArray
//type JSONStringifyable = object | number | string | boolean

export type TrackedRequestState = 'success' | 'failure' | 'pending'

export interface TrackedRequestEffects {
  success: string
  failure: string
}

export interface TrackedHttpRequest {
  id: number
  state: TrackedRequestState
  effect: TrackedRequestEffects
  params: JQueryAjaxSettings
  data: JSONValue
  error: any // XXX specify better
}

export interface HttpState {
  outbox: TrackedHttpRequest[]
  lastRequestId: number
}
