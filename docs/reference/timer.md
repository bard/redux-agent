
The timer task handler allows creating simple timers.


## Task: Default

This task describes a timer and the action that should be dispatched at the specified interval.

```js
{
  type: 'timer',
  interval: number, // time in ms at which the tick action should be dispatched
  actions: {
    tick: string    // action type to dispatch when the number has been generated
  }
}
```

!!! tip
    To stop a timer, simply remove the task (see how in the [example](#example)).

### Actions

Event Type | Meta | Payload |
-----------|------|---------|
`tick` | None | None |

## Example

[Run this example »](/examples/#timer)

```js
--8<--
demo/src/examples/timer.js
--8<--
```
