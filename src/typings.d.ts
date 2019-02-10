interface NodeModule {
  hot: any
}

type JSONObject = {[key: string]: JSONValue}
interface JSONArray extends Array<JSONValue> {}
type JSONValue = string | number | boolean | null | JSONObject | JSONArray
type JSONStringifyable = object | number | string | boolean

interface WebSocket {
  sendJSON(data: JSONStringifyable): void
}
