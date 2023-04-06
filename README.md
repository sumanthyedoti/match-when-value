## Note:

- Fails if array/object to match with is empty
- Passes with two empty arrays/object
- `_` is used to match any value
  - if `_` is last elements to match-by array, it catches the remaining values
- `~` is used to match any character and skip remaining elements in array pattern
  - if elements are not picked, returns original array
  - if elements are picked, returns array of picked elements
- `~_` is used to pick all the remaining values
