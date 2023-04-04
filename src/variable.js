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
  }
}

export default match
