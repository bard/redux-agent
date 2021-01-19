
# Random Number Generator

The RNG task handler allows generating random numbers outside of the reducer, so as not to make the reducer impure.

## Task: Default

This task causes a random number to be generated and to be dispatched back to as payload of the prescribe action.

```js
{
  type: 'rng',
  actions: {
    result: string // action type to dispatch when the number has been generated
  }
}
```

### Actions

Event Type | Meta | Payload |
-----------|------|---------|
`result` | none | number |

## Example

[Run this example »](/examples/#rng)

```js
--8<--
demo/src/examples/rng.js
--8<--
```
