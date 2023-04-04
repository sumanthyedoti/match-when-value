function match(x) {
  const by = (valToMatch) => {
    const then = (valToReturn) => {
      return x === valToMatch ? valToReturn : false
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
