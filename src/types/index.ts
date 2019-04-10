export interface JSONObject { [key: string]: JSONValue }
interface JSONArray extends Array<JSONValue> { }
type JSONValue = string | number | boolean | null | JSONObject | JSONArray
// type JSONStringifyable = object | number | string | boolean
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
