
The HTTP task handler allows to perform HTTP requests using `window.fetch`.

## Configuration

| Parameter | Type | Description |
|-----------|------|-------------|
| baseUrl | string | Optional. Prepended to all request URLs, defaults to empty string. |
| fetchDefaults | object | Optional. Included in all `window.fetch` calls, defaults to empty. |

Example:

```js
import { configureAgents, createHttpAgent } from 'redux-agent'

store.subscribe(configureAgents([
  createHttpAgent({
    // cause requests to /foo/bar to be sent to /api/v1/foo/bar
    baseUrl: '/api/v1',
    // allow authenticated CORS
    fetchDefaults: {
      credentials: 'include'
    }
  })
], store))
```

## Task: Default

This task describes an HTTP request and the actions to dispatch based on its completion.

```js
{
  type: 'http',
  url: string,       // URL to request
  method: string,    // HTTP method
  body: any,         // optional, data for POST/PUT/PATCH
  actions: {
    success: string, // action type to dispatch when request succeeds
    failure: string  // action type to dispatch when request fails
  },
  ...rest            // any other parameters are forwarded to window.fetch
}
```

!!! note
    If `data` is an object, it will be encoded to JSON and the `content-type` header will be set accordingly.

!!! note
    Responses are considered successful when the status code is in the 2xx range. Responses are considered failed when the status code is in the 4xx and 5xx range or when the request could not be sent (e.g. due to a network problem). This is in contrast with the `fetch` spec where 4xx and 5xx responses are also considered successful.

### Actions

Event Type | Meta | Payload |
-----------|------|---------|
`success` | `{ status: number }` | The response body. Automatically decoded to object if json, otherwise string |
`failure` | `{ status: number }` | The response body. Automatically decoded to object if json, otherwise string |

## Example

[Run this example »](/examples/#http)

```js
--8<--
demo/src/examples/http.js
--8<--
```
