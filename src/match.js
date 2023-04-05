function isArraysMatch(arr1, arr2) {
  if (arr1.length < arr2.length) return false
  if (arr2.length < arr1.length && arr2.at(-1) !== "_") return false
  if (arr1.length > 0 && arr2.length === 0) return false
  for (let i = 0; i < arr2.length; i++) {
    if (arr2[i] === "_") continue
    if (arr1[i] !== arr2[i]) return false
    // if (!isValuesMatch(arr1[i], arr2[i])) return false
  }
  return true
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0
}

function isObjectsMatch(obj1, obj2) {
  if (!isObjectEmpty(obj1) && isObjectEmpty(obj2)) return false
  for (const key in obj2) {
    if (obj1[key] !== obj2[key]) return false
  }
  return true
}

function isValuesMatch(val1, val2) {
  if (typeof val1 !== typeof val2) return false
  if (Array.isArray(val1) && Array.isArray(val2)) {
    return isArraysMatch(val1, val2)
  }
  if (typeof val1 === "object" && val1 !== null) {
    return isObjectsMatch(val1, val2)
  }
  return val1 === val2
}

function match(x) {
  const by = (valToMatch) => {
    const then = (valToReturn) => {
      const val = isValuesMatch(x, valToMatch)
      if (!val) return val
      if (typeof valToReturn === "function") {
        const callback = valToReturn
        return callback(valToMatch)
      }
      return valToReturn
    }
    return {
      then,
    }
  }
  function booleanCallback(valueToReturn) {
    if (!x) return false
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
