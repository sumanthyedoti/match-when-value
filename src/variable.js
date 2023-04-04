function isArraysMatch(arr1, arr2) {
  if(arr1.length < arr2.length) return false
  if(arr1.length > 0 && arr2.length === 0) return false
  for (let i = 0; i < arr2.length; i++) {
    if(arr1[i] !== arr2[i]) return false
  }
  return true
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function isObjectsMatch(obj1, obj2) {
  if(!isObjectEmpty(obj1) && isObjectEmpty(obj2)) return false
  for (const key in obj2) {
    if(obj1[key] !== obj2[key]) return false
  }
  return true
}

function isValuesMatch(val1, val2) {
  if(typeof val1 !== typeof val2) return false
  if(Array.isArray(val1) && Array.isArray(val2)) {
    return isArraysMatch(val1, val2)
  }
  if(typeof val1 === 'object' && val1 !== null) {
    return isObjectsMatch(val1, val2)
  }
  return val1 === val2
}

function match(x) {
  const by = (valToMatch) => {
    const then = (valToReturn) => {
      if(typeof valToReturn === 'function') {
        const callback = valToReturn
        return isValuesMatch(x, valToMatch) ? callback(valToMatch) : false
      }
      return isValuesMatch(x, valToMatch) ? valToReturn : false
    }
    return {
      then,
    }
  }
  return {
    by,
    then: (valueToReturn) => x === true ? valueToReturn : false
  }
}

export default match
