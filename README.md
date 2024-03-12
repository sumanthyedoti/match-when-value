# match-when-value

- A pattern matching library written in pure JavaScript

## Install

```sh
npm install match-when-value
```

## Examples

- factorial

```js
function factorial(n) {
  return match(n)
    .when(0, 1)
    .when("_", (n) => {
      return n * factorial(n - 1)
    }).value
}

console.log(factorial(10)) // 3628800
```

- array length

```js
function length(li) {
  return match(li)
    .when([], 0)
    .when("_", (li) => {
      return 1 + length(li.slice(1))
    }).value
}
console.log(length([4, 3, 2, 1])) // 4
```

## Usage

```js
import match from "match-when-value"

match(original)
  .when(target1, returnValue)
  .when(target2, (value) => {
    // callback function
  }).value
```

### Primitive values

```js
const num = 10
const isTen = match(num).when(10, true).when("_", false).value
console.log(isTen) // true

const n = 1
console.log(
  match(n === 10)
    .when(true, "The number is 10")
    .when(false, "The number is not 10").value,
) // The number is not 10
```

- `when("_")` is fallback to catch any value

### composite values

- can match composite values like arrays, objects
- arrays

```js
const primesunder10 = [2, 3, 5, 7]
console.log(
  match(primesunder10)
    .when([2, 3, 5, 7], (primes) => primes.map((p) => p * 10))
    .when("_", []).value,
) // [20, 30, 50, 70]
```

- objects

```js
const person = {
  name: "John Doe",
  age: 55,
  hasACat: true,
  gender: "M",
}
console.log(
  match(person)
    .when({ age: 55, name: "John Doe", hasACat: true }, "He is our uncle John")
    .when({ name: "John Doe" }, "He is John but not our uncle")
    .when("_", "He is not John").value,
) // He is our John uncle
```

### Pick and Skip

- Not just that, can pick or skip values
  | Description | Pattern |
  | ----------- | ----------- |
  | pick one element | `~` |
  | pick all remaining elements | `~;` |
  | Skip one elements | `_` |
  | Skip all remaining elements | `_;` |
- with arrays

```js
console.log(
  match([2, 3, 4, 1, 5])
    .when([2, 3, "~"], "Not a match")
    .when([2, 3, "~", "_"], "Not a match")
    .when([2, 3, "~", "_;"], (x) => {
      console.log(`${x} follows 2 and 3`)
    }).value,
) // "4 follows 2 and 3"

console.log(
  match([2, 3, 4, 1, 5])
    .when(["_", "_", "_", "~", "_"], (x) => {
      console.log(`4th element is ${x} in the array of length 5`)
    })
    .when(["_", "_", "_", 1, "_"], () => {
      console.log(`4th element is 1 in the array of length 5`)
    }).value,
) // 4th element is 1 in the array of length 5
```

- with objects

```js
console.log(match({ x: 1, y: 2, z: 3 }).when({ x: 1, y: "~" }, (x) => x).value)
// { y: 2 }
```

- can pick nested objects too

```js
console.log(
  match({ x: 1, y: { x: 10 }, z: 3 }).when({ x: 1, y: { x: "~" } }, (x) => x)
    .value,
) // { y: { x: 10 } }
```

- Look at this

```js
console.log(
  match({ x: 1, y: { x: [10, 20] }, z: 3 }).when(
    { x: 1, y: { x: [10, "~"] } },
    (x) => x,
  ).value,
) // { y: { x: [ 20 ] } }
```

### With function callback

```js
const num = 10
const isTen = match(num).when(10, true).when("_", false).value
console.log(isTen) // true
```

## To-do

- Provide Typescript types
- Explore Errors scenarios and throw specific Errors

## Note:

- Fails if array/object to match with is empty
- Passes with two empty arrays/object
- if array matches (without picks in match-array), original array is returned
- if object matches (without picks in match-object), original-object is returned
  - if picks exists, objects is returned only picked fields
- `~` is used to match any element and skip remaining elements in array pattern
  - if elements are not picked, returns original array
  - if elements are picked, returns array of picked elements
