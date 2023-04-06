import { FAIL_VALUE } from "./config"

function isArraysMatch(arr1, arr2) {
  const variables = []
  if (arr1.length < arr2.length) return [false, FAIL_VALUE]
  if (arr2.length < arr1.length && arr2.at(-1) !== "_") {
    return [false, FAIL_VALUE]
  }
  if (arr1.length > 0 && arr2.length === 0) return [false, FAIL_VALUE]
  for (let i = 0; i < arr2.length; i++) {
    if (arr2[i] === "_") continue
    if (arr2[i] === "~") {
      variables.push(arr1[i])
      continue
    }
    if (arr1[i] !== arr2[i]) return [false, FAIL_VALUE]
    // if (!isValuesMatch(arr1[i], arr2[i])) return false
  }
  return [true, variables.length ? variables : arr1]
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0
}

function isObjectsMatch(obj1, obj2) {
  if (!isObjectEmpty(obj1) && isObjectEmpty(obj2)) return [false, FAIL_VALUE]
  for (const key in obj2) {
    if (obj1[key] !== obj2[key]) return [false, FAIL_VALUE]
  }
  return [true, obj2]
}

function isValuesMatch(val1, val2) {
  if (typeof val1 !== typeof val2) return [false, FAIL_VALUE]
  if (Array.isArray(val1) && Array.isArray(val2)) {
    return isArraysMatch(val1, val2)
  }
  if (typeof val1 === "object" && val1 !== null) {
    return isObjectsMatch(val1, val2)
  }
  return val1 === val2 ? [true, val2] : [false, FAIL_VALUE]
}

function match(x) {
  const by = (valToMatch) => {
    const then = (valToReturn) => {
      const [isMatch, returnValue] = isValuesMatch(x, valToMatch)
      if (!isMatch) return returnValue
      if (typeof valToReturn === "function") {
        const callback = valToReturn
        return callback(returnValue)
      }
      return valToReturn
    }
    return {
      then,
    }
  }
  function booleanCallback(valueToReturn) {
    if (!x) return FAIL_VALUE
    if (typeof valueToReturn === "function") {
      const callback = valueToReturn
      return callback(x)
    }
    return valueToReturn
  }

  return {
    by,
    then: booleanCallback,
  }
}

export default match
