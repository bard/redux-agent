// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#Polyfill

export default <T>(
  o: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean
): number => {
  // 1. Let O be ? ToObject(this value).
  // if (this == null) {
  //   throw new TypeError('"this" is null or not defined');
  // }

  // 2. Let len be ? ToLength(? Get(O, "length")).
  // tslint:disable-block
  const len = o.length

  // 3. If IsCallable(predicate) is false, throw a TypeError exception.
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function')
  }

  // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
  // var thisArg = arguments[1]

  // 5. Let k be 0.
  let k = 0

  // 6. Repeat, while k < len
  while (k < len) {
    // a. Let Pk be ! ToString(k).
    // b. Let kValue be ? Get(O, Pk).
    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
    // d. If testResult is true, return k.
    const kValue = o[k]
    if (predicate.call(null, kValue, k, o)) {
      return k
    }
    // e. Increase k by 1.
    k++
  }

  // 7. Return -1.
  return -1
}
