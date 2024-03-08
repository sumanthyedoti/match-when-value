export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0
}

export function isFalsy(value) {
  return value === null || value === undefined
}

export function lastElement(arr) {
  return arr[arr.length - 1]
}
