import variableMatch from './variable'

function matchIf(x) {
  if(Array.isArray(x)) return
  if(typeof x === "object") return
  return variableMatch(x)
}

export default matchIf
