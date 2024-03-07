function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0
}

function isFalsy(value) {
  return value === null || value === undefined
}

function lastElement(arr) {
  return arr[arr.length - 1]
}

module.exports = {
  isObjectEmpty,
  lastElement,
  isFalsy,
}
