function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0
}

function lastElement(arr) {
  return arr[arr.length - 1]
}

module.exports = {
  isObjectEmpty,
  lastElement,
}
