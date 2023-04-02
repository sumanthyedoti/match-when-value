function matchIf(x) {
  const is = (valToMatch) => {
    const then = (valToReturn) => {
      return x === valToMatch ? valToReturn : false
    }
    return {
      then,
    }
  }
  return {
    is,
  }
}

export default matchIf
