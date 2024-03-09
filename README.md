# Pattern Matching

- A pattern matching library written in pure JavaScript

## Install

```sh
npm install pattern-matching
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
- `_` is used to match any value
  - if `_` is last elements to match-by array, it catches the remaining values
- `~` is used to match any character and skip remaining elements in array pattern
  - if elements are not picked, returns original array
  - if elements are picked, returns array of picked elements
- `~_` is used to pick all the remaining values
