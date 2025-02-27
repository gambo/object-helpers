# object-helpers

## Why not Lodash.
You should absolutely use lodash. The constraints for re-creating this deep setter and getter pair of functions was
to streamline it for use in constructing unknown-type ad-hoc JSON formstate, thus it's implementation has a narrower success range.

This library 
## JSON type

The JSON type helps rapidly prototype with nested POJO's and arrays without necessarily knowing the type before hand.

```js
import type { JSON } from 'object-helpers'
```

The JSON type is used internally for the `get` and `set` functions, and has been exposed for convenience

## get function

The get function is a lean implementation of 'lodash.get' as it has been marked as deprecated.
While JS provides optional chaining, there are DX benefits to having a get function that can deeply request data using a more flexible path construct. It is designed to produce a valid value if it exists, or undefined for all other inputs.

```js
import { get } from 'object-helpers'

let a = {a: {b: {c: {d: [undefined, {e: 'the value'}]}}}}
get(a, 'a.b.c.d.1.2') // 'the value'
get(a, 'bad.path.here') // undefined
get(a, '1.2.3') ?? 'oops' // oops
get(a, 'a.b.c.d.2') // {e: 'the value'}
```

## set function

The set function is a lean implementation of 'lodash.set'. It will set a nested path in dot-notation on an object or array.
Array indices are anything that can parse to integer. 

All successful invocations will return the object modified in place. All failures will trigger an Exception
```js
import { set } from 'object-helpers'

let a = {a: {b: {c: {d: {e: 1}}}}}
set(a, 'a.b.c.d.1.2', 'new value') // {a: {b: {c: {d: [undefined, [undefined, undefined, 'new value']]}}}}
set([], '0.0.0.0', 'nested arrays') // [[[['nested arrays']]]]
```

