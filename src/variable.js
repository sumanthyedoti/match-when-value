function isArrayMatches(arr1, arr2) {
  if(arr1.length < arr2.length) return false
  for (let i = 0; i < arr2.length; i++) {
    if(arr1[i] !== arr2[i]) return false
  }
  return true
}

function isValuesMatch(val1, val2) {
  if(Array.isArray(val1) && Array.isArray(val2)) {
    return isArrayMatches(val1, val2)
  }
  return val1 === val2
}

function match(x) {
  const by = (valToMatch) => {
    const then = (valToReturn) => {
      if(typeof x !== typeof valToMatch) return false
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
